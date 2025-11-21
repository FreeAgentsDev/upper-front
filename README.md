# 🎨 Upper Barber Cuts - Sitio Web Profesional

Barbería y tienda de cuidado masculino en Manizales, Colombia. Sitio web moderno y profesional construido con Astro, React y Tailwind CSS.

## 📋 Tabla de Contenidos

- [Características Principales](#características-principales)
- [Panel de Administración](#panel-de-administración)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación y Uso](#instalación-y-uso)
- [Mejoras y Avances](#mejoras-y-avances)
- [Guía del Administrador](#guía-del-administrador)

---

## ✨ Características Principales

### 🏠 Páginas del Sitio

- **Inicio**: Hero section impactante con servicios destacados y productos
- **Servicios**: Catálogo completo de servicios de barbería con categorías:
  - Servicios Principales (Corte, Diseño de Barba)
  - Combos y Adiciones
  - Servicios Sin Cita
- **Tienda**: Tienda online con productos de cuidado masculino
- **Experiencia**: Galería visual del ambiente y servicios
- **Contacto**: Información de contacto, ubicación y formulario WhatsApp

### 🎨 Diseño y Estilos

- **Paleta de Colores Profesional**:
  - Brand Ink (#010101) - Fondo principal
  - Brand Amber (#f7941f) - Color de acento
  - Brand Light (#ffffff) - Texto principal
  - Brand Stone (#1a1a1a) - Bordes y elementos secundarios

- **Efectos Visuales Mejorados**:
  - Animaciones suaves y profesionales
  - Gradientes y efectos de hover
  - Cards con efectos de elevación
  - Transiciones fluidas en todos los elementos
  - Efectos de brillo y sombras dinámicas

- **Responsive Design**:
  - Diseño completamente adaptable a todos los dispositivos
  - Navegación optimizada para móviles
  - Imágenes optimizadas con formato WebP

---

## 🔐 Panel de Administración

### 🚀 Funcionalidades Completas

El panel de administración permite gestionar completamente el contenido del sitio desde el frontend.

#### Acceso al Panel

1. Haz clic en el botón **"Admin"** en el header (después del botón Reserva)
2. Ingresa la contraseña: `admin123` (puedes cambiarla en el código)
3. Accede al panel completo de administración

### 📊 Gestión de Servicios

**CRUD Completo de Servicios:**
- ✅ **Crear**: Agrega nuevos servicios con el botón "+ Nuevo Servicio"
- ✅ **Leer**: Visualiza todos los servicios con información completa
- ✅ **Actualizar**: Edita servicios existentes con formulario completo
- ✅ **Eliminar**: Elimina servicios con confirmación

**Campos editables:**
- Nombre del servicio
- Categoría (Principal, Combo, Sin Cita)
- Duración
- Precio (formato texto y número)
- Resumen/Descripción
- Características (lista editable)
- ID único

### 🛍️ Gestión de Productos

**CRUD Completo de Productos:**
- ✅ **Crear**: Agrega nuevos productos con el botón "+ Nuevo Producto"
- ✅ **Leer**: Visualiza productos con preview de imágenes
- ✅ **Actualizar**: Edita productos existentes
- ✅ **Eliminar**: Elimina productos con confirmación

**Características especiales:**
- **Subida de Imágenes**: 
  - Sube imágenes desde tu computadora (se guardan como base64)
  - O ingresa rutas manuales (ej: `/media/tienda/...`)
  - Preview en tiempo real de las imágenes
- **Campos editables:**
  - Nombre del producto
  - Categoría (Cuidado, Styling, Herramientas, Maquinaria)
  - Descripción
  - Precio
  - Imagen (ruta o archivo subido)
  - ID único

### 🛒 Tienda y Carrito de Compras

**Tienda Online:**
- ✅ **Catálogo de Productos**: Visualización organizada por categorías
- ✅ **Búsqueda de Productos**: Busca por nombre, descripción o categoría
- ✅ **Filtros por Categoría**: Filtra productos por tipo (Cuidado, Styling, Herramientas, Maquinaria)
- ✅ **Vista de Detalles**: Modal con información completa de cada producto

**Carrito de Compras:**
- ✅ **Carrito Inteligente**: 
  - **Móviles**: Botón flotante que abre una vista completa del carrito
  - **Desktop**: Sidebar lateral siempre visible
- ✅ **Gestión de Cantidad**: Aumenta/disminuye cantidad de productos
- ✅ **Eliminar Productos**: Quita productos del carrito fácilmente
- ✅ **Total Dinámico**: Calcula el total automáticamente
- ✅ **Envío por WhatsApp**: Genera mensaje preformateado con el pedido completo
- ✅ **Crear Combos Personalizados**: Crea combos desde los productos del carrito

### 🎁 Gestión de Combos

**Dos tipos de combos:**

1. **Combos de Servicios** (categoría 'combo'):
   - Servicios combinados predefinidos
   - Se editan igual que los servicios normales
   - Ejemplos: "Corte + Barba", "Corte + Cejas", etc.

2. **Combos Personalizados**:
   - Combos creados por los usuarios
   - Pueden incluir múltiples servicios
   - Precio personalizado

**Funcionalidades:**
- ✅ Visualización mejorada con tarjetas destacadas
- ✅ Crear nuevos combos personalizados
- ✅ Editar combos existentes (servicios y personalizados)
- ✅ Eliminar combos
- ✅ Agregar/quitar servicios de combos personalizados
- ✅ Asignar precios y descripciones personalizadas

### 📝 Interfaz del Panel de Admin

**Diseño Visual Mejorado:**
- Tarjetas con gradientes y efectos hover
- Información organizada en secciones claras
- Badges de colores para identificar tipos:
  - 🟠 Naranja: Combos de Servicio
  - 🟣 Púrpura: Combos Personalizados
  - 🟠 Amber: Servicios y Productos
- Iconos de check para características
- Cajas destacadas para precios e información importante
- Botones grandes y accesibles con efectos hover

**Navegación por Tabs:**
- **Servicios**: Gestiona todos los servicios
- **Productos**: Gestiona productos de la tienda
- **Combos**: Gestiona combos de servicios y personalizados

---

## 🛠️ Tecnologías Utilizadas

- **Framework**: [Astro](https://astro.build/) v5.15.5
- **React**: v19.2.0 (para componentes interactivos)
- **TypeScript**: Tipado estático
- **Tailwind CSS**: v4.1.17 (estilos)
- **Optimización de Imágenes**: Sharp
- **Almacenamiento**: localStorage (frontend)

---

## 📁 Estructura del Proyecto

```
upper-1/
├── public/
│   ├── media/              # Imágenes y multimedia
│   │   ├── barberia/       # Imágenes de la barbería
│   │   ├── servicios/      # Imágenes de servicios
│   │   ├── tienda/         # Imágenes de productos
│   │   └── otros/          # Otras imágenes
│   ├── favicon.svg         # Favicon personalizado
│   └── site.webmanifest    # Manifest PWA
├── src/
│   ├── components/
│   │   ├── admin/          # Componentes del panel admin
│   │   │   ├── AdminLogin.tsx
│   │   │   ├── AdminPanel.tsx
│   │   │   └── DataLoader.tsx
│   │   ├── store/          # Componentes de la tienda
│   │   ├── Header.astro
│   │   └── Footer.astro
│   ├── data/
│   │   ├── services.ts     # Datos de servicios
│   │   ├── products.ts     # Datos de productos
│   │   ├── combos.ts       # Sistema de combos personalizados
│   │   └── testimonials.ts # Testimonios
│   ├── layouts/
│   │   └── Layout.astro    # Layout principal
│   ├── pages/
│   │   ├── admin/          # Páginas del admin
│   │   │   ├── index.astro
│   │   │   └── login.astro
│   │   ├── index.astro     # Página de inicio
│   │   ├── servicios.astro
│   │   ├── tienda/
│   │   ├── experiencia.astro
│   │   └── contacto.astro
│   └── styles/
│       └── global.css      # Estilos globales mejorados
├── scripts/
│   └── optimize-images.js  # Script de optimización
└── package.json
```

---

## 🚀 Instalación y Uso

### Prerrequisitos

- Node.js 18+ y npm

### Instalación

```bash
# Clonar el repositorio
git clone [url-del-repo]

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# El sitio estará disponible en http://localhost:4321
```

### Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm run optimize-images  # Optimizar imágenes
```

---

## 🎉 Mejoras y Avances

### 📱 Responsividad Completa (Última Actualización)

**Mejoras Móviles Implementadas:**
- ✅ **Header Responsivo**: Menú hamburguesa en móviles con navegación completa
- ✅ **Botón Admin Móvil**: Accesible desde el menú móvil
- ✅ **Panel de Administración Responsivo**: 
  - Tabs adaptativos
  - Formularios optimizados para móviles
  - Tarjetas con layout flexible
- ✅ **Carrito Móvil Mejorado**: 
  - Botón flotante estilo WhatsApp
  - Vista completa del carrito en móviles
  - Sidebar solo en desktop
- ✅ **Todas las Páginas Optimizadas**:
  - Página de inicio con espaciado adaptativo
  - Servicios con grid responsivo
  - Tienda completamente responsive
  - Contacto y experiencia optimizados
- ✅ **Botón WhatsApp Flotante**: Tamaño adaptativo según dispositivo
- ✅ **Footer Responsive**: Navegación optimizada para móviles

### ✨ Mejoras de Diseño Implementadas

#### 1. **CSS Global Mejorado**
- Nuevas animaciones profesionales:
  - `animate-float`: Flotación suave
  - `animate-pulse-glow`: Pulso con brillo
  - `animate-slide-up`: Deslizamiento hacia arriba
  - `animate-gradient-shift`: Gradiente animado en texto

- Clases utilitarias mejoradas:
  - `.card-enhanced`: Tarjetas con efectos avanzados
  - `.btn-enhanced`: Botones con efectos shimmer
  - `.text-gradient-enhanced`: Gradientes animados de texto
  - `.section-enhanced`: Secciones con fondos mejorados
  - `.image-enhanced`: Imágenes con efectos hover

#### 2. **Header Mejorado**
- Backdrop blur más intenso
- Navegación con efectos de gradiente en hover
- Botón Admin con estilo púrpura llamativo e icono de candado
- Espaciado y padding optimizados
- Transiciones suaves en todos los elementos

#### 3. **Footer Mejorado**
- Gradientes de fondo más sutiles
- Mejor contraste y legibilidad
- Efectos hover mejorados en enlaces
- Espaciado optimizado

#### 4. **Páginas Mejoradas**

**Página de Inicio:**
- Hero section con animaciones mejoradas
- Cards de servicios con efectos hover profesionales
- Secciones con gradientes sutiles
- Espaciado y tipografía refinados

**Página de Servicios:**
- Cards mejorados con animaciones escalonadas
- Mejor jerarquía visual
- Información más clara y organizada

**Página de Contacto:**
- Cards con bordes redondeados más grandes
- Mejor organización visual
- Efectos hover mejorados

**Página de Experiencia:**
- Galería con cards mejorados
- Mejor presentación visual

### 🔐 Sistema de Administración

#### Características Implementadas

1. **Autenticación**
   - Sistema de login con contraseña
   - Contraseña por defecto: `admin123`
   - Sesión persistente con localStorage

2. **Gestión de Servicios**
   - CRUD completo (Crear, Leer, Actualizar, Eliminar)
   - Filtrado por categorías
   - Formularios completos con validación

3. **Gestión de Productos**
   - CRUD completo
   - Subida de imágenes (base64 o rutas)
   - Preview de imágenes
   - Categorización

4. **Gestión de Combos**
   - Visualización de combos de servicios
   - Creación y edición de combos personalizados
   - Agregar/quitar servicios de combos
   - Precios personalizados

5. **Almacenamiento**
   - Todos los cambios se guardan en localStorage
   - Los datos persisten entre sesiones
   - Los cambios se reflejan inmediatamente en el sitio

### 🎨 Mejoras Visuales del Panel Admin

- **Tarjetas Mejoradas**: Diseño con gradientes y sombras
- **Información Organizada**: Secciones claras y separadas
- **Badges de Color**: Identificación visual por tipo
- **Iconos**: Checkmarks y otros iconos para mejor UX
- **Botones Destacados**: Botones grandes con efectos hover
- **Estado Vacío**: Mensajes claros cuando no hay contenido

### 📸 Gestión de Imágenes

- **Subida de Archivos**: Los usuarios pueden subir imágenes directamente
- **Preview en Tiempo Real**: Vista previa antes de guardar
- **Múltiples Formatos**: Soporte para base64 y rutas
- **Optimización**: Las imágenes se muestran optimizadas
- **Manejo de Errores**: Fallback cuando las imágenes no cargan

### 🎯 Optimizaciones

- **Performance**: Animaciones optimizadas con CSS
- **Carga**: Lazy loading de imágenes
- **Responsive**: Diseño adaptativo completo (mobile-first)
- **Accesibilidad**: Contraste y legibilidad mejorados
- **SEO**: Meta tags y estructura semántica
- **UX Móvil**: Interacciones táctiles optimizadas
- **Breakpoints**: Diseño optimizado para todos los tamaños de pantalla

### 🛒 Funcionalidades de Tienda Avanzadas

**Carrito de Compras:**
- Vista completa en móviles al hacer clic en el botón flotante
- Sidebar lateral en desktop
- Contadores de cantidad dinámicos
- Badge con número de productos en el botón flotante
- Generación automática de mensaje WhatsApp con pedido completo

**Gestión de Productos:**
- Filtrado por categoría en tiempo real
- Búsqueda instantánea
- Modal de detalles con información completa
- Añadir al carrito desde cualquier vista

**Combos Personalizados:**
- Crear combos desde productos en el carrito
- Guardado en localStorage
- Disponibles en la página de servicios

---

## 📖 Guía del Administrador

### 🔑 Acceder al Panel

1. Navega al sitio web
2. Haz clic en el botón **"Admin"** (púrpura) en el header
3. Ingresa la contraseña: `admin123`
4. ¡Accede al panel completo!

### ➕ Crear un Nuevo Servicio

1. Ve al tab **"Servicios"**
2. Haz clic en **"+ Nuevo Servicio"**
3. Completa todos los campos:
   - Nombre (ej: "Corte Premium")
   - Categoría (Principal, Combo, o Sin Cita)
   - Duración (ej: "60 min")
   - Precio en texto (ej: "$25.000")
   - Precio en número (ej: 25000)
   - Resumen (descripción corta)
   - Características (una por línea)
   - ID único (ej: "corte-premium")
4. Haz clic en **"Crear"**

### 🛍️ Crear un Nuevo Producto

1. Ve al tab **"Productos"**
2. Haz clic en **"+ Nuevo Producto"**
3. Completa los campos:
   - Nombre
   - Categoría
   - Descripción
   - Precio
   - Imagen:
     - **Opción 1**: Sube una imagen (haz clic en "Elegir archivo")
     - **Opción 2**: Ingresa una ruta (ej: `/media/tienda/mi-producto.webp`)
   - ID único
4. Verás el preview de la imagen en tiempo real
5. Haz clic en **"Crear"**

### 🎁 Crear un Combo Personalizado

1. Ve al tab **"Combos"**
2. Haz clic en **"+ Nuevo Combo Personalizado"**
3. Completa:
   - Nombre del combo
   - Descripción (opcional)
   - Precio total
   - Agrega servicios:
     - Selecciona un servicio del dropdown
     - Haz clic en "Agregar"
     - Repite para agregar más servicios
     - Puedes eliminar servicios con el botón "Eliminar"
4. Haz clic en **"Crear"**

### ✏️ Editar un Elemento

1. En cualquier tab, encuentra el elemento que quieres editar
2. Haz clic en el botón **"Editar"**
3. Modifica los campos necesarios
4. Haz clic en **"Guardar"**

### 🗑️ Eliminar un Elemento

1. Encuentra el elemento que quieres eliminar
2. Haz clic en el botón **"Eliminar"** (rojo)
3. Confirma la eliminación
4. El elemento será eliminado permanentemente

### 💾 Persistencia de Datos

- Todos los cambios se guardan automáticamente en localStorage
- Los datos persisten entre sesiones del navegador
- Los cambios se reflejan inmediatamente en el sitio público
- **Nota**: Los datos en localStorage son específicos del navegador/dispositivo

---

## 🎨 Personalización

### Cambiar la Contraseña del Admin

Edita el archivo `src/components/admin/AdminLogin.tsx`:

```typescript
const ADMIN_PASSWORD = 'tu-nueva-contraseña';
```

### Modificar Colores

Los colores están definidos en `src/styles/global.css`:

```css
--color-brand-ink: #010101;
--color-brand-amber: #f7941f;
--color-brand-light: #ffffff;
```

### Agregar Nuevas Categorías

Edita los tipos en `src/data/products.ts` o `src/data/services.ts`.

---

## 📝 Notas Importantes

### Almacenamiento de Datos

- Los datos se guardan en **localStorage** del navegador
- Esto significa que los cambios son **locales al navegador/dispositivo**
- Para producción, considera implementar un backend con base de datos

### Imágenes

- Las imágenes subidas se guardan como **base64** en localStorage
- Esto puede hacer que localStorage sea grande
- Para producción, considera usar un servicio de almacenamiento de imágenes

### Backup

- Exporta regularmente los datos desde localStorage
- Puedes hacerlo desde la consola del navegador:
  ```javascript
  JSON.stringify({
    services: localStorage.getItem('admin_services'),
    products: localStorage.getItem('admin_products'),
    combos: localStorage.getItem('upper-custom-combos')
  })
  ```

---

## 🚀 Próximas Mejoras Sugeridas

- [ ] Sistema de autenticación con backend
- [ ] Base de datos real para persistencia
- [ ] Subida de imágenes a servidor/cloud
- [ ] Sistema de reservas online
- [ ] Integración con pasarelas de pago
- [ ] Panel de analytics
- [ ] Notificaciones push
- [ ] Multiidioma

---

## 📞 Soporte

Para más información o soporte, contacta al equipo de desarrollo.

---

## 📄 Licencia

Todos los derechos reservados © 2025 Upper Barber Cuts

---

**Desarrollado con ❤️ para Upper Barber Cuts**
