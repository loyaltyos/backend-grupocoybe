import { NextRequest, NextResponse } from "next/server";
import {
  corsHeaders,
  forbiddenOriginResponse,
  isAllowedOrigin,
} from "@/lib/cors";
import { getProduct } from "@/lib/products";

type RouteContext = { params: Promise<{ id: string }> };

export function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!isAllowedOrigin(origin)) return forbiddenOriginResponse();
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin!) });
}

export async function GET(request: NextRequest, context: RouteContext) {
  const origin = request.headers.get("origin");
  if (!isAllowedOrigin(origin)) return forbiddenOriginResponse();

  const { id } = await context.params;
  const product = getProduct(id);
  if (!product) {
    return NextResponse.json(
      { error: "Producto no encontrado" },
      { status: 404, headers: corsHeaders(origin!) },
    );
  }

  return NextResponse.json({
    name: product.name,
    description: product.description,
    price: product.unitPrice,
    category: product.category,
  }, { headers: corsHeaders(origin!) });
}
