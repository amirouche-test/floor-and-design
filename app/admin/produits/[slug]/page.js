// app/produit/[slug]/page.js

import ProductDetails from '@/components/ProductDetails'

export default function Page({ params }) {
  return <ProductDetails slug={params.slug} />
}
