import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set('floor-and-design-token', '', {
    httpOnly: true,
    expires: new Date(0), // expire immédiatement
    path: '/',
  });

  return Response.json({ message: 'Déconnexion réussie' });
}
