import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('floor-and-design-token')?.value;

    const payload = await verifyToken(token);
    if (!payload) {
      return Response.json({ success: false, likedProducts: [] }, { status: 200 });
    }

    await connectDB();
    const user = await User.findById(payload.id).select('likedProducts');

    if (!user) {
      return Response.json({ success: false, likedProducts: [] }, { status: 200 });
    }

    return Response.json({ success: true, likedProducts: user.likedProducts });

  } catch (err) {
    console.error('Erreur GET /user/likes:', err);
    return Response.json({ success: false, likedProducts: [] }, { status: 500 });
  }
}
