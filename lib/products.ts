export type Product = {
  id: string;
  name: string;
  category?: string;
  description: string;
  /** Price in Mexican centavos. Never accept this value from the browser. */
  unitPrice: number;
};

// Initial illustrative prices. Replace them with the approved MarmolMX CSV before production.
const products = {
  "compra-minima-prueba": {
    id: "compra-minima-prueba",
    name: "Compra mínima de prueba",
    category: "Prueba",
    description: "Producto temporal para validar pagos reales con Conekta.",
    unitPrice: 10000,
  },
  "cemento-cpc-50kg": {
    id: "cemento-cpc-50kg",
    name: "Cemento CPC 50 kg",
    description: "Saco de cemento CPC de 50 kg",
    unitPrice: 28900,
  },
  "varilla-3-8": {
    id: "varilla-3-8",
    name: "Varilla 3/8 pulg",
    description: "Varilla corrugada para construcción",
    unitPrice: 17900,
  },
  "varilla-1-2": {
    id: "varilla-1-2",
    name: "Varilla 1/2 pulg",
    description: "Varilla corrugada para construcción",
    unitPrice: 30900,
  },
  "block-construccion": {
    id: "block-construccion",
    name: "Block de construcción",
    description: "Block de concreto para construcción",
    unitPrice: 2200,
  },
  "arena-m3": {
    id: "arena-m3",
    name: "Arena por m³",
    description: "Metro cúbico de arena para construcción",
    unitPrice: 89000,
  },
  "grava-m3": {
    id: "grava-m3",
    name: "Grava por m³",
    description: "Metro cúbico de grava para construcción",
    unitPrice: 99000,
  },
} as const satisfies Record<string, Product>;

export function getProduct(productId: string): Product | undefined {
  return products[productId as keyof typeof products];
}
