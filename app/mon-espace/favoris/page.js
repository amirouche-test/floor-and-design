"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";

export default function LikedProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState(new Set()); // pour gérer les clicks rapides

  useEffect(() => {
    const fetchLikedProducts = async () => {
      try {
        const res = await fetch("/api/products/liked", { cache: "no-store" });

        if (!res.ok) {
          throw new Error(`Erreur serveur: ${res.status}`);
        }

        const data = await res.json();

        if (Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          console.error("Format inattendu reçu :", data.products);
          setProducts([]);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des produits likés", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedProducts();
  }, []);

  async function toggleLike(productId) {
    if (processingIds.has(productId)) return; // éviter double clic
    setProcessingIds(new Set(processingIds).add(productId));

    try {
      const res = await fetch("/api/user/like", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: productId }),
      });

      const data = await res.json();

      if (data.success) {
        // Mise à jour locale : si le produit était liké, on l'enlève, sinon on le garde
        setProducts((prev) =>
          prev.filter((product) => product._id !== productId)
        );
        toast.success(data.message);
      } else {
        toast.error(data.message || "Erreur lors de la mise à jour des favoris");
      }
    } catch (error) {
      toast.error("Erreur serveur.");
      console.error(error);
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded shadow animate-pulse overflow-hidden"
          >
            <div className="w-full h-48 bg-gray-200" />
            <div className="p-3 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-gray-500 text-lg">
          Vous n’avez pas encore liké de produit ❤️
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-70px)] sm:min-h-[calc(100vh-120px)]">
      <h1 className="text-2xl font-bold mb-6">Mes Produits Likés</h1>
      <div className="grid grid-cols-2 cursor-pointer sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {products.map((product, index) => (
          <div
            key={product._id || `${product.slug}-${index}`}
            className="relative w-42 h-full bg-white rounded shadow hover:shadow-lg transition overflow-hidden group"
          >
            {/* Icône cœur cliquable */}
            <button
              onClick={() => toggleLike(product._id)}
              disabled={processingIds.has(product._id)}
              aria-label={
                processingIds.has(product._id)
                  ? "Traitement en cours"
                  : "Retirer des favoris"
              }
              className="absolute top-3 right-3 z-10 bg-white p-1 rounded-full shadow focus:outline-none"
            >
              <Heart
                className={`w-5 h-5 text-red-500 fill-red-500 cursor-pointer transition-transform ${
                  processingIds.has(product._id) ? "opacity-50" : "opacity-100"
                }`}
              />
            </button>

            {/* Image */}
            <Link href={`/produits/${product.slug}`}>
              <div className="relative w-full h-48">
                <Image
                  src={product.image || "/images/placeholder.png"}
                  alt={product.name || "Produit"}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
            </Link>

            {/* Infos produit */}
            <div className="p-3">
              <h2 className="text-sm font-semibold truncate">{product.name}</h2>
              <p className="text-gray-500 text-sm">
                {product.price
                  ? `${product.price.toLocaleString()} DA`
                  : "Prix non disponible"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
