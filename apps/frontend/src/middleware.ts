import { NextResponse, type NextRequest } from 'next/server';

const AUTH_ROUTES = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;
  const isAuthenticated = Boolean(accessToken);
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isAuthRoute = AUTH_ROUTES.includes(pathname);
  const isHomeRoute = pathname === '/';

  if (isDashboardRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if ((isAuthRoute || isHomeRoute) && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/register', '/dashboard/:path*'],
};
