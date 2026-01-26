import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SUPPORTED_LOCALES = ["ro", "en"] as const;
const DEFAULT_LOCALE = "ro";

function getPreferredLocale(request: NextRequest): string {
  // Check cookie first
  const cookieLocale = request.cookies.get("locale")?.value;
  if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale as typeof SUPPORTED_LOCALES[number])) {
    return cookieLocale;
  }

  // Check Accept-Language header
  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage) {
    const languages = acceptLanguage
      .split(",")
      .map((lang) => {
        const [code, priority = "q=1"] = lang.trim().split(";");
        const q = parseFloat(priority.replace("q=", "")) || 1;
        return { code: code.split("-")[0].toLowerCase(), q };
      })
      .sort((a, b) => b.q - a.q);

    for (const lang of languages) {
      if (SUPPORTED_LOCALES.includes(lang.code as typeof SUPPORTED_LOCALES[number])) {
        return lang.code;
      }
    }
  }

  return DEFAULT_LOCALE;
}

// Next.js 16+ uses "proxy" function instead of "middleware"
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip proxy for static files, API routes, and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.includes(".") // Files with extensions (images, etc.)
  ) {
    return NextResponse.next();
  }

  const response = NextResponse.next();

  // Set locale cookie if not present
  if (!request.cookies.get("locale")) {
    const preferredLocale = getPreferredLocale(request);
    response.cookies.set("locale", preferredLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: "lax",
    });
  }

  // Add security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)",
  ],
};
