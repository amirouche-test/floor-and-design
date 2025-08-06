import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;
const encoder = new TextEncoder();

export async function signToken(user) {
  return await new SignJWT({
      id: user._id.toString(), // ✅ conversion explicite
      role: user.role
    })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(encoder.encode(JWT_SECRET));
}


export async function verifyToken(token) {
  try {
    if (!token) return null;
    const { payload } = await jwtVerify(token, encoder.encode(JWT_SECRET));
    return payload;
  } catch (error) {
    console.error('Erreur vérification token:', error);
    return null;
  }
}
