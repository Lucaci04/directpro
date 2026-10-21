import { defineMiddleware } from 'astro:middleware';
import { isAuthenticated } from './lib/auth';

// Tot ce e sub /admin cere sesiune validă, cu excepția paginii de login.
export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  const isAdmin = pathname === '/admin' || pathname.startsWith('/admin/');
  if (isAdmin && !pathname.startsWith('/admin/login') && !isAuthenticated(context.cookies)) {
    return context.redirect('/admin/login', 303);
  }
  const response = await next();
  if (isAdmin) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    response.headers.set('Cache-Control', 'no-store');
    response.headers.set('X-Frame-Options', 'DENY');
  }
  return response;
});
