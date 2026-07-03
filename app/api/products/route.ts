import { NextRequest, NextResponse } from "next/server";
import {
  corsHeaders,
  forbiddenOriginResponse,
  isAllowedOrigin,
} from "@/lib/cors";
import { getSellableProducts } from "@/lib/products";

export function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!isAllowedOrigin(origin)) return forbiddenOriginResponse();
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin!) });
}

export function GET(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!isAllowedOrigin(origin)) return forbiddenOriginResponse();

  const products = getSellableProducts().map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    category: product.category,
    price: product.unitPrice,
    imageUrl: product.imageUrl ?? "",
  }));

  return NextResponse.json(products, { headers: corsHeaders(origin!) });
}
