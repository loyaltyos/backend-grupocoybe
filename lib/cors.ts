import { NextResponse } from "next/server";

const PRODUCTION_ORIGINS = new Set([
  "https://backend-grupocoybe.vercel.app",
  "https://grupocoybe.com",
  "https://www.grupocoybe.com",
]);
const LOCAL_ORIGIN = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

export function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  if (PRODUCTION_ORIGINS.has(origin)) return true;
  return process.env.NODE_ENV !== "production" && LOCAL_ORIGIN.test(origin);
}

export function isAllowedPublicReadOrigin(origin: string | null): boolean {
  if (!origin) return true;
  if (PRODUCTION_ORIGINS.has(origin)) return true;
  if (process.env.NODE_ENV !== "production" && LOCAL_ORIGIN.test(origin)) return true;

  try {
    const url = new URL(origin);
    if (url.protocol !== "https:") return false;

    return url.hostname === "builder.hostinger.com"
      || url.hostname.endsWith(".builder.hostinger.com")
      || url.hostname.endsWith(".hostingersite.com");
  } catch {
    return false;
  }
}

export function corsHeaders(origin: string | null): HeadersInit {
  const headers: HeadersInit = {
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };

  if (origin) headers["Access-Control-Allow-Origin"] = origin;
  return headers;
}

export function forbiddenOriginResponse(): NextResponse {
  return NextResponse.json({ error: "Origen no permitido" }, { status: 403 });
}
