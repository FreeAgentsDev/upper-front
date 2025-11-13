export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  source: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 'opher',
    quote:
      'Llegué por recomendación y me sorprendió la atención. Entendieron lo que quería desde la primera consulta y salí con el mejor corte que he tenido.',
    author: 'Opher',
    source: 'Google Reviews',
  },
  {
    id: 'benjamin',
    quote:
      'Viajé desde Hawái para vivir la experiencia Upper. Son profesionales, amables y el ambiente es tan bueno que quieres volver antes del próximo corte.',
    author: 'Benjamin Castro',
    source: 'Google Reviews',
  },
  {
    id: 'daniel',
    quote:
      'Hay pedagogía en cada servicio. Te explican lo que hacen y por qué. Además sales con recomendaciones personalizadas para mantener el look.',
    author: 'Daniel Pérez',
    source: 'Google Reviews',
  },
];


