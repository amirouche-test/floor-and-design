import { NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(req) {
  const token = req.cookies.get('floor-and-design-token')?.value;
  const { pathname } = req.nextUrl;

  let user = null;

  try {
    if (token) {
      user = await verifyToken(token);
    }
  } catch (err) {
    user = null;
  }

  if(user && pathname.startsWith('/connexion')) 
    return NextResponse.redirect(new URL('/', req.url));

  if(user && pathname.startsWith('/inscription')) 
    return NextResponse.redirect(new URL('/', req.url));

  // Auth guards
  if (pathname.startsWith('/admin')) {
    if (!user) return NextResponse.redirect(new URL('/connexion', req.url));
    if (user.role !== 'admin') return NextResponse.redirect(new URL('/', req.url));
  }

  if (pathname.startsWith('/mon-espace')) {
    if (!user) return NextResponse.redirect(new URL('/connexion', req.url));
    if (user.role !== 'user') return NextResponse.redirect(new URL('/', req.url));
  }

  // Inject pathname into a temporary cookie
  const res = NextResponse.next();
  res.cookies.set('__pathname', pathname, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
  });

  return res;
}

export const config = {
  matcher: ['/', '/:path*'],
};
