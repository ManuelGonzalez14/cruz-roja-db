import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Comprobar si existe la cookie de sesión
  const cookieSession = request.cookies.get('session_cruz_roja');

  // Si intentan entrar a la página principal (/) y no tienen sesión,
  // los mandamos a la página de login.
  if (!cookieSession && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Si intentan ir al login pero ya tienen sesión,
  // los mandamos a la página principal.
  if (cookieSession && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Configurar en qué rutas se ejecutará este middleware
export const config = {
  matcher: ['/', '/login'],
};
