export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  /** Price in Mexican centavos. Never accept this value from the browser. */
  unitPrice: number;
};

// Server-side catalog synchronized from productos-coybe-marmolmx-hostinger.csv.
// Prices are integer Mexican centavos and must never come from the browser.
const products = {
  "compra-minima-prueba": {
    id: "compra-minima-prueba",
    name: "Compra mínima de prueba",
    category: "Prueba",
    description: "Producto temporal para validar pagos reales con Conekta.",
    unitPrice: 10000,
  },
  "marmol-carrara-premium": {
    id: "marmol-carrara-premium",
    name: "Mármol Carrara Premium",
    category: "Mármol",
    description: "Placa premium para cubiertas, muros decorativos y acabados interiores de alto nivel.",
    unitPrice: 299000,
  },
  "marmol-travertino-beige": {
    id: "marmol-travertino-beige",
    name: "Mármol Travertino Beige",
    category: "Mármol",
    description: "Material elegante para pisos, muros y detalles arquitectónicos.",
    unitPrice: 269000,
  },
  "cubierta-de-cocina-premium": {
    id: "cubierta-de-cocina-premium",
    name: "Cubierta de Cocina Premium",
    category: "Cubiertas",
    description: "Cubierta fabricada a medida para cocinas residenciales y proyectos premium.",
    unitPrice: 899000,
  },
  "piso-de-marmol-pulido": {
    id: "piso-de-marmol-pulido",
    name: "Piso de Mármol Pulido",
    category: "Pisos",
    description: "Acabado resistente y elegante para interiores residenciales o comerciales.",
    unitPrice: 149000,
  },
  "granito-negro-san-gabriel": {
    id: "granito-negro-san-gabriel",
    name: "Granito Negro San Gabriel",
    category: "Granito",
    description: "Granito oscuro ideal para cubiertas, barras y superficies de alto uso.",
    unitPrice: 199000,
  },
  "granito-gris-oxford": {
    id: "granito-gris-oxford",
    name: "Granito Gris Oxford",
    category: "Granito",
    description: "Superficie resistente con estética moderna para proyectos contemporáneos.",
    unitPrice: 179000,
  },
  "lavabo-de-marmol-artesanal": {
    id: "lavabo-de-marmol-artesanal",
    name: "Lavabo de Mármol Artesanal",
    category: "Baños",
    description: "Pieza artesanal para baños premium y proyectos de diseño interior.",
    unitPrice: 499000,
  },
  "escalon-de-marmol-a-medida": {
    id: "escalon-de-marmol-a-medida",
    name: "Escalón de Mármol a Medida",
    category: "Escaleras",
    description: "Escalón personalizado para residencias, edificios y espacios comerciales.",
    unitPrice: 129000,
  },
  "piedra-natural-para-fachada": {
    id: "piedra-natural-para-fachada",
    name: "Piedra Natural para Fachada",
    category: "Fachadas",
    description: "Recubrimiento exterior para fachadas modernas y proyectos arquitectónicos.",
    unitPrice: 139000,
  },
  "cuarzo-blanco-premium": {
    id: "cuarzo-blanco-premium",
    name: "Cuarzo Blanco Premium",
    category: "Cuarzo",
    description: "Material elegante y resistente para cocinas, baños y superficies premium.",
    unitPrice: 249000,
  },
  "onix-iluminado-premium": {
    id: "onix-iluminado-premium",
    name: "Ónix Iluminado Premium",
    category: "Ónix",
    description: "Acabado decorativo exclusivo para muros, barras y espacios de alto impacto.",
    unitPrice: 499000,
  },
  "recubrimiento-decorativo-premium": {
    id: "recubrimiento-decorativo-premium",
    name: "Recubrimiento Decorativo Premium",
    category: "Recubrimientos",
    description: "Solución decorativa para interiores, muros principales y proyectos comerciales.",
    unitPrice: 179000,
  },
} as const satisfies Record<string, Product>;

export function getProduct(productId: string): Product | undefined {
  return products[productId as keyof typeof products];
}
