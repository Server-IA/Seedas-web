import { authMiddleware, redirectToSignIn } from '@clerk/nextjs/server';

export default authMiddleware({
  publicRoutes: ['/', '/sign-in', '/sign-up'], // Rutas públicas que no requieren autenticación
  afterAuth: (auth, req, evt) => {
    if (!auth.userId && !auth.sessionId) {
      return redirectToSignIn({ returnBack: true });
    }
  }
});

// En _middleware.js o en app/api/middleware.js
import authMiddleware from '../../lib/auth';

export default authMiddleware;
