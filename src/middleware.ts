import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// =============================================================================
// Maintenance Mode Middleware
// =============================================================================
// When MAINTENANCE_MODE=true in .env, all requests are rewritten to the
// maintenance page. The /maintenance route itself and static assets are
// always allowed through so the page renders correctly.
// =============================================================================

export function middleware(request: NextRequest) {
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === 'true';

  if (!isMaintenanceMode) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  // Allow the maintenance page itself to render
  if (pathname.startsWith('/maintenance')) {
    return NextResponse.next();
  }

  // Allow static assets and API routes (so the maintenance page loads properly)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/downloads') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // static files like .css, .js, .svg, etc.
  ) {
    return NextResponse.next();
  }

  // Rewrite all other requests to the maintenance page
  return NextResponse.rewrite(new URL('/maintenance', request.url));
}

export const config = {
  // Match all routes except Next.js internals
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
