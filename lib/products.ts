export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl?: string;
  enabled: boolean;
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
    enabled: true,
    unitPrice: 10000,
  },
  "marmol-carrara-premium": {
    id: "marmol-carrara-premium",
    name: "Mármol Carrara Premium",
    category: "Mármol",
    description: "Placa premium para cubiertas, muros decorativos y acabados interiores de alto nivel.",
    imageUrl: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=900",
    enabled: true,
    unitPrice: 299000,
  },
  "marmol-travertino-beige": {
    id: "marmol-travertino-beige",
    name: "Mármol Travertino Beige",
    category: "Mármol",
    description: "Material elegante para pisos, muros y detalles arquitectónicos.",
    imageUrl: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=900",
    enabled: true,
    unitPrice: 269000,
  },
  "cubierta-de-cocina-premium": {
    id: "cubierta-de-cocina-premium",
    name: "Cubierta de Cocina Premium",
    category: "Cubiertas",
    description: "Cubierta fabricada a medida para cocinas residenciales y proyectos premium.",
    imageUrl: "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&q=80&w=900",
    enabled: true,
    unitPrice: 899000,
  },
  "piso-de-marmol-pulido": {
    id: "piso-de-marmol-pulido",
    name: "Piso de Mármol Pulido",
    category: "Pisos",
    description: "Acabado resistente y elegante para interiores residenciales o comerciales.",
    imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=900",
    enabled: true,
    unitPrice: 149000,
  },
  "granito-negro-san-gabriel": {
    id: "granito-negro-san-gabriel",
    name: "Granito Negro San Gabriel",
    category: "Granito",
    description: "Granito oscuro ideal para cubiertas, barras y superficies de alto uso.",
    imageUrl: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=900",
    enabled: true,
    unitPrice: 199000,
  },
  "granito-gris-oxford": {
    id: "granito-gris-oxford",
    name: "Granito Gris Oxford",
    category: "Granito",
    description: "Superficie resistente con estética moderna para proyectos contemporáneos.",
    imageUrl: "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?auto=format&fit=crop&q=80&w=900",
    enabled: true,
    unitPrice: 179000,
  },
  "lavabo-de-marmol-artesanal": {
    id: "lavabo-de-marmol-artesanal",
    name: "Lavabo de Mármol Artesanal",
    category: "Baños",
    description: "Pieza artesanal para baños premium y proyectos de diseño interior.",
    imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=900",
    enabled: true,
    unitPrice: 499000,
  },
  "escalon-de-marmol-a-medida": {
    id: "escalon-de-marmol-a-medida",
    name: "Escalón de Mármol a Medida",
    category: "Escaleras",
    description: "Escalón personalizado para residencias, edificios y espacios comerciales.",
    imageUrl: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&w=900",
    enabled: true,
    unitPrice: 129000,
  },
  "piedra-natural-para-fachada": {
    id: "piedra-natural-para-fachada",
    name: "Piedra Natural para Fachada",
    category: "Fachadas",
    description: "Recubrimiento exterior para fachadas modernas y proyectos arquitectónicos.",
    imageUrl: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&q=80&w=900",
    enabled: true,
    unitPrice: 139000,
  },
  "cuarzo-blanco-premium": {
    id: "cuarzo-blanco-premium",
    name: "Cuarzo Blanco Premium",
    category: "Cuarzo",
    description: "Material elegante y resistente para cocinas, baños y superficies premium.",
    imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=900",
    enabled: true,
    unitPrice: 249000,
  },
  "onix-iluminado-premium": {
    id: "onix-iluminado-premium",
    name: "Ónix Iluminado Premium",
    category: "Ónix",
    description: "Acabado decorativo exclusivo para muros, barras y espacios de alto impacto.",
    imageUrl: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=900",
    enabled: true,
    unitPrice: 499000,
  },
  "recubrimiento-decorativo-premium": {
    id: "recubrimiento-decorativo-premium",
    name: "Recubrimiento Decorativo Premium",
    category: "Recubrimientos",
    description: "Solución decorativa para interiores, muros principales y proyectos comerciales.",
    imageUrl: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&q=80&w=900",
    enabled: true,
    unitPrice: 179000,
  },
} as const satisfies Record<string, Product>;

export function getProduct(productId: string): Product | undefined {
  const product = products[productId as keyof typeof products];
  return product && isSellableProduct(product) ? product : undefined;
}

export function getSellableProducts(): Product[] {
  return Object.values(products).filter(isSellableProduct);
}

function isSellableProduct(product: Product): boolean {
  return Boolean(
    product.enabled &&
    product.id.trim() &&
    product.name.trim() &&
    product.description.trim() &&
    product.category.trim() &&
    Number.isSafeInteger(product.unitPrice) &&
    product.unitPrice > 0,
  );
}
