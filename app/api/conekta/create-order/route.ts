import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createConektaOrder } from "@/lib/conekta";
import { corsHeaders, forbiddenOriginResponse, isAllowedOrigin } from "@/lib/cors";
import { getProduct } from "@/lib/products";

export const runtime = "nodejs";

const requestSchema = z.object({
  productId: z.string().trim().min(1).max(100),
  quantity: z.number().int().min(1).max(100),
  customer: z.object({
    name: z.string().trim().min(2).max(120),
    email: z.email().max(254),
    phone: z.string().trim().regex(/^\+?[0-9][0-9\s()-]{7,19}$/),
  }).strict(),
}).strict();

export function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!isAllowedOrigin(origin)) return forbiddenOriginResponse();
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin!) });
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!isAllowedOrigin(origin)) return forbiddenOriginResponse();
  const headers = corsHeaders(origin!);

  try {
    const parsed = requestSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "No se pudo iniciar el pago" },
        { status: 400, headers },
      );
    }

    const product = getProduct(parsed.data.productId);
    if (!product) {
      return NextResponse.json(
        { error: "No se pudo iniciar el pago" },
        { status: 400, headers },
      );
    }

    const totalAmount = product.unitPrice * parsed.data.quantity;
    if (!Number.isSafeInteger(totalAmount) || totalAmount < 1) {
      throw new Error("Invalid server-side order total");
    }

    const order = await createConektaOrder({
      product,
      quantity: parsed.data.quantity,
      totalAmount,
      customer: parsed.data.customer,
    });
    const checkoutRequestId = order.checkout?.id;
    if (!checkoutRequestId) throw new Error("Conekta response did not include checkout.id");

    return NextResponse.json({
      orderId: order.id,
      checkoutRequestId,
      checkoutUrl: order.checkout?.url ?? null,
    }, { headers });
  } catch (error) {
    console.error("Unable to initialize payment", {
      reason: error instanceof Error ? error.message : "unknown",
    });
    return NextResponse.json(
      { error: "No se pudo iniciar el pago" },
      { status: 500, headers },
    );
  }
}
