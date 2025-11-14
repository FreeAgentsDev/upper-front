import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_DIR = path.join(process.env.HOME || '/Users/m1gue', 'Downloads/uppermedia');
const OUTPUT_DIR = path.join(__dirname, '../public/media');
const MAX_WIDTH = 1920;
const THUMBNAIL_WIDTH = 400;
const QUALITY = 85;

// Extensiones de imagen soportadas
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

async function optimizeImage(inputPath, outputDir, baseName) {
  try {
    const stats = await fs.stat(inputPath);
    console.log(`Procesando: ${path.basename(inputPath)} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);

    // Crear nombre base sin extensión
    const nameWithoutExt = path.parse(baseName).name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // Generar WebP principal
    const webpPath = path.join(outputDir, `${nameWithoutExt}.webp`);
    console.log(`  Guardando en: ${webpPath}`);
    await sharp(inputPath)
      .resize(MAX_WIDTH, null, { withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(webpPath);
    console.log(`  ✓ Archivo guardado: ${webpPath}`);

    // Generar JPG fallback
    const jpgPath = path.join(outputDir, `${nameWithoutExt}.jpg`);
    await sharp(inputPath)
      .resize(MAX_WIDTH, null, { withoutEnlargement: true })
      .jpeg({ quality: QUALITY, mozjpeg: true })
      .toFile(jpgPath);

    // Generar thumbnail WebP
    const thumbPath = path.join(outputDir, `${nameWithoutExt}-thumb.webp`);
    await sharp(inputPath)
      .resize(THUMBNAIL_WIDTH, null, { withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(thumbPath);

    const webpStats = await fs.stat(webpPath);
    const jpgStats = await fs.stat(jpgPath);
    const thumbStats = await fs.stat(thumbPath);

    console.log(`  ✓ WebP: ${(webpStats.size / 1024).toFixed(2)} KB`);
    console.log(`  ✓ JPG: ${(jpgStats.size / 1024).toFixed(2)} KB`);
    console.log(`  ✓ Thumbnail: ${(thumbStats.size / 1024).toFixed(2)} KB`);
    console.log(`  → ${nameWithoutExt}.webp\n`);

    return {
      webp: `${nameWithoutExt}.webp`,
      jpg: `${nameWithoutExt}.jpg`,
      thumb: `${nameWithoutExt}-thumb.webp`,
    };
  } catch (error) {
    console.error(`Error procesando ${inputPath}:`, error.message);
    return null;
  }
}

async function processDirectory(sourceDir, outputBaseDir) {
  try {
    const files = await fs.readdir(sourceDir);
    const results = {
      barberia: [],
      servicios: [],
      tienda: [],
      ambiente: [],
      otros: [],
    };

    for (const file of files) {
      const filePath = path.join(sourceDir, file);
      const ext = path.extname(file).toLowerCase();

      // Saltar videos y archivos no imagen
      if (ext === '.mp4' || ext === '.mov' || ext === '.avi') {
        console.log(`⏭️  Saltando video: ${file}`);
        continue;
      }

      if (!IMAGE_EXTENSIONS.includes(ext)) {
        console.log(`⏭️  Saltando archivo no imagen: ${file}`);
        continue;
      }

      // Clasificar imagen según nombre/contenido
      const fileName = file.toLowerCase();
      let category = 'otros';
      let subcategory = null;

      // Detectar categorías
      if (
        fileName.includes('interior') ||
        fileName.includes('exterior') ||
        fileName.includes('barber') ||
        fileName.includes('silla') ||
        fileName.includes('equipo') ||
        fileName.includes('ambiente') ||
        fileName.includes('ubicación') ||
        fileName.includes('historia') ||
        fileName.includes('location')
      ) {
        category = 'barberia';
      } else if (
        fileName.includes('corte') ||
        fileName.includes('barba') ||
        fileName.includes('ceja') ||
        fileName.includes('combo') ||
        fileName.includes('servicio') ||
        fileName.includes('before') ||
        fileName.includes('after') ||
        fileName.includes('antes') ||
        fileName.includes('después')
      ) {
        category = 'servicios';
      } else if (
        fileName.includes('producto') ||
        fileName.includes('shampoo') ||
        fileName.includes('aceite') ||
        fileName.includes('balsamo') ||
        fileName.includes('pomada') ||
        fileName.includes('cera') ||
        fileName.includes('trimmer') ||
        fileName.includes('maquina') ||
        fileName.includes('navaja') ||
        fileName.includes('tijera') ||
        fileName.includes('kit') ||
        fileName.includes('beard') ||
        fileName.includes('pen') ||
        fileName.includes('cuidado') ||
        fileName.includes('hidratación') ||
        fileName.includes('peine')
      ) {
        category = 'tienda';
        // Detectar subcategoría
        if (
          fileName.includes('shampoo') ||
          fileName.includes('aceite') ||
          fileName.includes('balsamo') ||
          fileName.includes('cuidado') ||
          fileName.includes('hidratación')
        ) {
          subcategory = 'cuidado';
        } else if (
          fileName.includes('trimmer') ||
          fileName.includes('maquina')
        ) {
          subcategory = 'maquinaria';
        } else if (
          fileName.includes('pomada') ||
          fileName.includes('cera') ||
          fileName.includes('polvo')
        ) {
          subcategory = 'styling';
        } else if (
          fileName.includes('navaja') ||
          fileName.includes('tijera') ||
          fileName.includes('kit') ||
          fileName.includes('peine')
        ) {
          subcategory = 'herramientas';
        }
      } else if (
        fileName.includes('calle') ||
        fileName.includes('parqueadero') ||
        fileName.includes('letrero') ||
        fileName.includes('vista')
      ) {
        category = 'ambiente';
      }

      // Determinar directorio de salida
      let outputDir = path.join(outputBaseDir, category);
      if (subcategory) {
        outputDir = path.join(outputBaseDir, category, subcategory);
      }

      // Crear directorio si no existe
      await fs.mkdir(outputDir, { recursive: true });

      // Optimizar imagen
      const result = await optimizeImage(filePath, outputDir, file);
      if (result) {
        const categoryKey = subcategory ? `${category}/${subcategory}` : category;
        if (!results[category]) results[category] = [];
        results[category].push({
          ...result,
          original: file,
          category: categoryKey,
        });
      }
    }

    return results;
  } catch (error) {
    console.error('Error procesando directorio:', error);
    throw error;
  }
}

async function main() {
  console.log('🚀 Iniciando optimización de imágenes...\n');
  console.log(`📁 Origen: ${SOURCE_DIR}`);
  console.log(`📁 Destino: ${OUTPUT_DIR}\n`);

  // Verificar que existe el directorio fuente
  try {
    await fs.access(SOURCE_DIR);
  } catch {
    console.error(`❌ No se encuentra el directorio: ${SOURCE_DIR}`);
    console.log('💡 Asegúrate de que la carpeta uppermedia esté en Downloads/');
    process.exit(1);
  }

  const results = await processDirectory(SOURCE_DIR, OUTPUT_DIR);

  console.log('\n✅ Optimización completada!\n');
  console.log('📊 Resumen:');
  console.log(`  Barbería: ${results.barberia.length} imágenes`);
  console.log(`  Servicios: ${results.servicios.length} imágenes`);
  console.log(`  Tienda: ${results.tienda.length} imágenes`);
  console.log(`  Ambiente: ${results.ambiente.length} imágenes`);
  console.log(`  Otros: ${results.otros.length} imágenes`);

  // Guardar reporte
  const reportPath = path.join(__dirname, '../../media-optimization-report.json');
  await fs.writeFile(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 Reporte guardado en: ${reportPath}`);
}

main().catch(console.error);

