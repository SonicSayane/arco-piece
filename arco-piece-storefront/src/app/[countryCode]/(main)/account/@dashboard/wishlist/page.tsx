import { Metadata } from "next"

import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { getWishlistHandles } from "@lib/data/wishlist"
import EmptyState from "@modules/common/components/empty-state"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ArcButton from "@modules/common/components/arc-button"
import ProductPreview from "@modules/products/components/product-preview"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Liste de souhaits",
  description: "Vos pièces sauvegardées pour plus tard.",
}

type Props = {
  params: Promise<{ countryCode: string }>
}

export default async function WishlistPage(props: Props) {
  const { countryCode } = await props.params
  const region = await getRegion(countryCode)

  if (!region) {
    notFound()
  }

  const handles = await getWishlistHandles()

  if (!handles.length) {
    return (
      <div className="w-full" data-testid="wishlist-page-wrapper">
        <div className="mb-8 flex flex-col gap-y-4">
          <h1 className="font-display text-2xl text-arc-ink">
            Liste de souhaits
          </h1>
        </div>
        <EmptyState
          size="md"
          title="Aucun article sauvegardé"
          description="Cliquez sur le cœur d'une pièce pour la retrouver ici plus tard."
          action={
            <LocalizedClientLink href="/store">
              <ArcButton variant="primary">Explorer le catalogue</ArcButton>
            </LocalizedClientLink>
          }
        />
      </div>
    )
  }

  const { response } = await listProducts({
    countryCode,
    queryParams: { handle: handles, limit: handles.length },
  })

  // Re-order to match the wishlist order (most recent first).
  const indexed = new Map(
    response.products.map((p) => [p.handle ?? "", p])
  )
  const ordered = handles
    .map((h) => indexed.get(h))
    .filter(
      (p): p is (typeof response.products)[number] => Boolean(p)
    )

  return (
    <div className="w-full" data-testid="wishlist-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-2">
        <h1 className="font-display text-2xl text-arc-ink">
          Liste de souhaits
        </h1>
        <p className="font-body text-sm text-arc-muted">
          {ordered.length} article{ordered.length > 1 ? "s" : ""} sauvegardé
          {ordered.length > 1 ? "s" : ""}.
        </p>
      </div>

      {ordered.length === 0 ? (
        <EmptyState
          size="md"
          title="Articles indisponibles"
          description="Les articles de votre liste ne sont plus disponibles dans cette région."
        />
      ) : (
        <ul className="grid grid-cols-2 medium:grid-cols-3 gap-x-6 gap-y-8">
          {ordered.map((product) => (
            <li key={product.id}>
              <ProductPreview product={product} region={region} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
