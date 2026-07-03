import { getProduct } from "@/lib/products";
import CheckoutClient from "./CheckoutClient";
import styles from "./checkout.module.css";

type CheckoutPageProps = {
  searchParams: Promise<{ product?: string | string[] }>;
};

function formatPrice(centavos: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(centavos / 100);
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const rawProductId = (await searchParams).product;
  const productId = typeof rawProductId === "string" ? rawProductId : "";
  const product = productId ? getProduct(productId) : undefined;

  if (!product) {
    return (
      <main className={styles.page}>
        <section className={styles.card}>
          <p className={styles.eyebrow}>Grupo Coybe</p>
          <h1>Producto no disponible</h1>
          <p className={styles.description}>
            El enlace de compra no contiene un producto válido. Regresa al catálogo y vuelve a intentarlo.
          </p>
          <a className={styles.backLink} href="https://grupocoybe.com">
            Volver al catálogo
          </a>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <header className={styles.productHeader}>
          <p className={styles.eyebrow}>{product.category}</p>
          <h1>{product.name}</h1>
          <p className={styles.description}>{product.description}</p>
          <p className={styles.price}>{formatPrice(product.unitPrice)} MXN</p>
        </header>
        <CheckoutClient
          productId={product.id}
          publicKey={process.env.NEXT_PUBLIC_CONEKTA_PUBLIC_KEY ?? ""}
        />
      </section>
    </main>
  );
}
