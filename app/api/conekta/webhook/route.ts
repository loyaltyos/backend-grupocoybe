import { NextRequest, NextResponse } from "next/server";
import {
  getWebhookKeyDiagnostics,
  verifyConektaWebhook,
} from "@/lib/conekta";

export const runtime = "nodejs";

type ConektaEvent = {
  id?: string;
  type?: string;
  livemode?: boolean;
  data?: { object?: { id?: string; status?: string } };
};

function signatureHeaderDiagnostics(request: NextRequest) {
  return [...request.headers.entries()]
    .filter(([name]) => /digest|signature/i.test(name))
    .map(([name, value]) => ({
      name,
      present: Boolean(value),
      length: value.length,
      preview: value.length > 12
        ? `${value.slice(0, 6)}...${value.slice(-4)}`
        : "[short]",
    }));
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const digest = request.headers.get("digest");

  let event: ConektaEvent;
  try {
    event = JSON.parse(rawBody) as ConektaEvent;
  } catch {
    console.warn("Invalid Conekta webhook payload", {
      method: request.method,
      signatureHeaders: signatureHeaderDiagnostics(request),
      webhookKey: getWebhookKeyDiagnostics(),
    });
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  const object = event.data?.object;
  const isVerificationPing =
    event.type === "webhook.created" && object?.status === "being_pinged";
  const signatureValid = Boolean(
    digest && verifyConektaWebhook(rawBody, digest),
  );

  console.info("Conekta webhook request", {
    method: request.method,
    eventType: event.type ?? "missing",
    objectStatus: object?.status ?? "missing",
    signatureValid,
    signatureHeaders: signatureHeaderDiagnostics(request),
    webhookKey: getWebhookKeyDiagnostics(),
  });

  // The activation handshake has no payment side effects. It is the only signature bypass.
  if (isVerificationPing) {
    return NextResponse.json({ received: true, verification: true });
  }

  // Payment and all other operational events always require a valid signature.
  if (!signatureValid) {
    return NextResponse.json({ error: "Firma inválida" }, { status: 401 });
  }

  if (!event.id || !event.type) {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  // Append-only logging is retry-safe. When a DB is added, event.id must be UNIQUE.
  console.info("Conekta webhook received", {
    eventId: event.id,
    eventType: event.type,
    orderId: object?.id,
    status: object?.status,
    livemode: event.livemode,
  });

  return NextResponse.json({ received: true });
}
