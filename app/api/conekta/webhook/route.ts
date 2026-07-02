import { NextRequest, NextResponse } from "next/server";
import { verifyConektaWebhook } from "@/lib/conekta";

export const runtime = "nodejs";

type ConektaEvent = {
  id?: string;
  type?: string;
  livemode?: boolean;
  data?: { object?: { id?: string; status?: string } };
};

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const digest = request.headers.get("digest");

  if (!digest || !verifyConektaWebhook(rawBody, digest)) {
    return NextResponse.json({ error: "Firma inválida" }, { status: 401 });
  }

  let event: ConektaEvent;
  try {
    event = JSON.parse(rawBody) as ConektaEvent;
  } catch {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  if (!event.id || !event.type) {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  // Structured append-only registration is naturally safe on retries. When a DB is added,
  // use event.id as a UNIQUE key and perform business side effects in the same transaction.
  console.info("Conekta webhook received", {
    eventId: event.id,
    eventType: event.type,
    orderId: event.data?.object?.id,
    status: event.data?.object?.status,
    livemode: event.livemode,
  });

  return NextResponse.json({ received: true });
}
