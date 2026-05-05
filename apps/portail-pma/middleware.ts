import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes publiques — accessibles sans session
const PUBLIC_PATHS = [
  "/login",
  "/ouverture-compte",
  "/api/auth/login",
  "/api/auth/logout",
  "/api/auth/reset-password",
];

// Routes API sensibles qui nécessitent une session au niveau middleware
// (double protection — les routes elles-mêmes vérifient aussi la session)
const PROTECTED_API_PREFIXES = [
  "/api/admin/",
  "/api/atc/",
  "/api/cdv/",
  "/api/rdm/",
  "/api/store/",
];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname.startsWith(p));
}

function isSensitiveApi(pathname: string) {
  return PROTECTED_API_PREFIXES.some((p) => pathname.startsWith(p));
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Assets Next.js — toujours laisser passer
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Routes publiques — toujours laisser passer
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const sessionCookie = req.cookies.get("pma_session");

  // Routes API sensibles — vérification cookie présent au niveau middleware
  // (la vérification complète est faite dans chaque route)
  if (isSensitiveApi(pathname)) {
    if (!sessionCookie) {
      return NextResponse.json(
        { success: false, message: "Non authentifié." },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // Autres routes API — laisser passer (chaque route vérifie elle-même)
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Routes pages — vérifier présence du cookie
  if (!sessionCookie) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("error", "session_required");
    // Stocker l'URL de destination pour redirect après login
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};