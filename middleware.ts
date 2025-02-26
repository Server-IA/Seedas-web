import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Definir las rutas protegidas
const isProtectedRoute = createRouteMatcher([
  '/indexPage(.*)',
  '/trasportaPage(.*)',
  '/zonaTrabajo(.*)',
  '/Payment(.*)',
]);

// Middleware de Clerk
export default clerkMiddleware((auth, req) => {
  if (!auth().userId && isProtectedRoute(req)) {
    // Redirigir a la página de inicio de sesión si no hay un usuario autenticado
    return auth().redirectToSignIn();
  }
});

// Configuración del matcher para proteger ciertas rutas y permitir que las rutas de webhook sean públicas
export const config = {
  matcher: [
    // Proteger todas las rutas excepto archivos estáticos y directorio _next
    '/((?!.*\\..*|_next).*)',
    '/',
    '/(api|trpc)(.*)',
    // Especificar que la ruta de webhook sea pública
    '/api/webhooks/user/:path*',
  ],
};
