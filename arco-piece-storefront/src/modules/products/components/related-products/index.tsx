import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { Heading, Text } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import Product from "../product-preview"

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
  /** Cap the rendered list — defaults to 8. */
  limit?: number
}

const RELATED_LIMIT = 8

export default async function RelatedProducts({
  product,
  countryCode,
  limit = RELATED_LIMIT,
}: RelatedProductsProps) {
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const metadata = (product.metadata ?? {}) as Record<string, unknown>
  const vehicleBrand =
    typeof metadata.vehicle_brand === "string"
      ? metadata.vehicle_brand
      : null

  // Try a tighter "compatible vehicle" match first, then fall back to
  // the same collection / tags. We do up to 2 queries so we never
  // surface a totally empty section when the vehicle filter is too
  // restrictive.
  const fetchByQuery = async (
    queryParams: HttpTypes.StoreProductListParams
  ) => {
    const merged: HttpTypes.StoreProductListParams = {
      ...queryParams,
      is_giftcard: false,
      limit,
    }
    if (region.id) merged.region_id = region.id

    return listProducts({
      queryParams: merged,
      countryCode,
    })
      .then(({ response }) =>
        response.products.filter((p) => p.id !== product.id)
      )
      .catch(() => [] as HttpTypes.StoreProduct[])
  }

  let products: HttpTypes.StoreProduct[] = []

  if (vehicleBrand) {
    // Medusa supports filtering on metadata via product list, but the
    // exact key shape varies — we ignore failures and fall through.
    products = await fetchByQuery({
      // @ts-expect-error metadata filter not in StoreProductListParams typings
      metadata: { vehicle_brand: vehicleBrand },
    })
  }

  if (products.length === 0) {
    const fallback: HttpTypes.StoreProductListParams = {}
    if (product.collection_id) {
      fallback.collection_id = [product.collection_id]
    }
    if (product.tags) {
      fallback.tag_id = product.tags
        .map((t) => t.id)
        .filter(Boolean) as string[]
    }
    products = await fetchByQuery(fallback)
  }

  if (!products.length) {
    return null
  }

  const visible = products.slice(0, limit)

  return (
    <section
      aria-label="Produits similaires"
      className="content-container py-10 small:py-14"
    >
      <div className="mb-5 small:mb-7">
        <Text className="font-body text-xs uppercase tracking-[0.18em] text-[var(--arc-accent)]">
          {vehicleBrand ? "Compatible avec" : "Suggestions"}
        </Text>
        <Heading
          level="h2"
          className="font-display mt-2 text-2xl small:text-3xl text-arc-ink"
        >
          {vehicleBrand
            ? `Autres pièces pour ${vehicleBrand}`
            : "Vous aimerez aussi"}
        </Heading>
      </div>

      <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-3 small:gap-4 medium:gap-6">
        {visible.map((p) => (
          <li key={p.id}>
            <Product region={region} product={p} />
          </li>
        ))}
      </ul>
    </section>
  )
}
