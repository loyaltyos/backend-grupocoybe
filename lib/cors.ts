import { NextResponse } from "next/server";

const PRODUCTION_ORIGIN = "https://grupocoybe.com";
const LOCAL_ORIGIN = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

export function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  if (origin === PRODUCTION_ORIGIN) return true;
  return process.env.NODE_ENV !== "production" && LOCAL_ORIGIN.test(origin);
}

export function corsHeaders(origin: string): HeadersInit {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

export function forbiddenOriginResponse(): NextResponse {
  return NextResponse.json({ error: "Origen no permitido" }, { status: 403 });
}
