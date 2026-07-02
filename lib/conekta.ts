import { createVerify } from "node:crypto";

const CONEKTA_API_URL = "https://api.conekta.io/orders";

export type CreateConektaOrderInput = {
  product: { id: string; name: string; description: string; unitPrice: number };
  quantity: number;
  totalAmount: number;
  customer: { name: string; email: string; phone: string };
};

type ConektaOrderResponse = {
  id: string;
  checkout?: { id?: string; url?: string };
};

export async function createConektaOrder(
  input: CreateConektaOrderInput,
): Promise<ConektaOrderResponse> {
  const privateKey = process.env.CONEKTA_PRIVATE_KEY;
  if (!privateKey) throw new Error("Missing CONEKTA_PRIVATE_KEY");

  const environment = privateKey.startsWith("key_") && privateKey.includes("test")
    ? "test"
    : process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "unknown";

  const response = await fetch(CONEKTA_API_URL, {
    method: "POST",
    headers: {
      Accept: "application/vnd.conekta-v2.2.0+json",
      "Accept-Language": "es",
      Authorization: `Bearer ${privateKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      checkout: {
        allowed_payment_methods: ["card", "bank_transfer", "cash"],
        type: "Integration",
        name: input.product.name,
      },
      customer_info: input.customer,
      currency: "MXN",
      pre_authorize: false,
      processing_mode: "ecommerce",
      line_items: [{
        name: input.product.name,
        description: input.product.description,
        sku: input.product.id,
        quantity: input.quantity,
        unit_price: input.product.unitPrice,
      }],
      metadata: {
        source: "hostinger-grupocoybe",
        productId: input.product.id,
        quantity: String(input.quantity),
        totalAmount: String(input.totalAmount),
        environment,
      },
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(12_000),
  });

  if (!response.ok) {
    // Log only operational identifiers; the provider body may contain customer data.
    console.error("Conekta order creation failed", { status: response.status });
    throw new Error(`Conekta request failed (${response.status})`);
  }

  return (await response.json()) as ConektaOrderResponse;
}

function webhookPublicKey(): string {
  const value = process.env.CONEKTA_WEBHOOK_SECRET;
  if (!value) throw new Error("Missing CONEKTA_WEBHOOK_SECRET");

  let normalized = value.trim().replace(/\\r\\n/g, "\n").replace(/\\n/g, "\n");
  if (
    (normalized.startsWith('"') && normalized.endsWith('"')) ||
    (normalized.startsWith("'") && normalized.endsWith("'"))
  ) {
    normalized = normalized.slice(1, -1).trim();
  }

  if (
    !normalized.startsWith("-----BEGIN PUBLIC KEY-----") ||
    !normalized.endsWith("-----END PUBLIC KEY-----")
  ) {
    throw new Error("Invalid Conekta webhook public key PEM");
  }

  return normalized;
}

export function getWebhookKeyDiagnostics() {
  const value = process.env.CONEKTA_WEBHOOK_SECRET;
  if (!value) {
    return { configured: false, hasPemBegin: false, hasPemEnd: false };
  }

  const normalized = value.trim().replace(/\\r\\n/g, "\n").replace(/\\n/g, "\n");
  return {
    configured: true,
    hasPemBegin: normalized.includes("-----BEGIN PUBLIC KEY-----"),
    hasPemEnd: normalized.includes("-----END PUBLIC KEY-----"),
    storedWithEscapedNewlines: value.includes("\\n"),
    characterCount: value.length,
  };
}

export function verifyConektaWebhook(rawBody: string, digest: string): boolean {
  try {
    const verifier = createVerify("RSA-SHA256");
    verifier.update(rawBody, "utf8");
    verifier.end();
    return verifier.verify(webhookPublicKey(), digest, "base64");
  } catch {
    return false;
  }
}
