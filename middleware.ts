import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/indexPage(.*)',
  '/about(.*)',
]);

export default clerkMiddleware((auth, req, res) => {
  if (!auth().userId && isProtectedRoute(req)) {

    // Add custom logic to run before redirecting

    // Redirige a tu propia página de inicio de sesión
    return auth().redirectToSignIn({ 
      signInURL: '/sign-in' 
    });
  }
});

export const config = { matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)']};
