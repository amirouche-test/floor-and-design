import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import Image from 'next/image'
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa'

export default async function ServerFooterWrapper() {
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
    return <></>;
  }

  return (
    <footer className="bg-[#121212] text-white px-6 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">

        {/* 🟩 Colonne 1 — Description + Contact + Réseaux */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-wide">FLOOR & DESIGN</h2>
          <p className="text-base text-gray-300 leading-relaxed">
            Chez Floor & Design, nous vous proposons des collections uniques et artistiques de carrelage haut de gamme, conçues pour enrichir votre intérieur avec style et élégance.
          </p>
          <div className="text-base text-gray-400 space-y-1 mt-4">
            <p>📍 Alger, Algérie</p>
            <p>📞 +213 555 123 456</p>
            <p>✉️ contact@floor-design.dz</p>
          </div>
          <div className="flex space-x-4 pt-3">
            <a href="#" className="text-gray-400 hover:text-white transition"><FaFacebookF /></a>
            <a href="#" className="text-gray-400 hover:text-white transition"><FaInstagram /></a>
            <a href="#" className="text-gray-400 hover:text-white transition"><FaLinkedinIn /></a>
          </div>
        </div>

        {/* 🟨 Colonne 2 — Logo centré */}
        <div className="flex justify-center items-start pt-4">
          <Image
            src="/footer-logo.png"
            alt="Logo Floor & Design"
            width={130}
            height={130}
            className="object-contain"
            priority
          />
        </div>

        {/* 🟦 Colonne 3 — Formulaire de contact */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Contact rapide</h3>
          <form className="space-y-3">
            <input
              type="text"
              placeholder="Votre nom"
              className="w-full px-4 py-2 bg-gray-800 text-white rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              type="email"
              placeholder="Votre e-mail"
              className="w-full px-4 py-2 bg-gray-800 text-white rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <textarea
              rows="3"
              placeholder="Votre message"
              className="w-full px-4 py-2 bg-gray-800 text-white rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-medium"
            >
              Envoyer
            </button>
          </form>
        </div>
      </div>

      {/* ✅ Bas de page */}
      <div className="mt-12 pt-6 border-t border-gray-700 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Floor & Design — Tous droits réservés
      </div>
    </footer>
  )
}
