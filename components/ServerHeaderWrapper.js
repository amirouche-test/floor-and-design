import { cookies } from "next/headers";
import Header from "@/components/Header";
import AdminHeader from "@/components/AdminHeader";
import { verifyToken } from "@/lib/auth";

export default async function ServerHeaderWrapper() {
  const cookieStore = await cookies();
  const token = cookieStore.get('floor-and-design-token')?.value;
  const pathname = cookieStore.get('__pathname')?.value || '';

  let user = null;
  try {
    if (token) {
      user = await verifyToken(token);
    }
  } catch {
    user = null;
  }

  const role = user?.role || 'guest';

  if (role === 'admin' && pathname.startsWith('/admin')) {
    return <AdminHeader />;
  }

  return <Header role={role} />;
}
