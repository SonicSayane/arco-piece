import { listProducts } from "@lib/data/products"
import { getRecentlyViewedHandles } from "@lib/data/recently-viewed"
import { Heading, Text } from "@medusajs/ui"
import ProductPreview from "@modules/products/components/product-preview"
import { HttpTypes } from "@medusajs/types"

type Props = {
  countryCode: string
  /** Handles to exclude (e.g. the current product page). */
  excludeHandles?: string[]
  region: HttpTypes.StoreRegion
  title?: string
  /** Max items to render. Defaults to 6. */
  limit?: number
}

const RecentlyViewed = async ({
  countryCode,
  excludeHandles = [],
  region,
  title = "Vus récemment",
  limit = 6,
}: Props) => {
  const allHandles = await getRecentlyViewedHandles()
  const handles = allHandles
    .filter((h) => !excludeHandles.includes(h))
    .slice(0, limit)

  if (handles.length === 0) return null

  let products: HttpTypes.StoreProduct[] = []
  try {
    const { response } = await listProducts({
      countryCode,
      queryParams: {
        handle: handles,
        limit: handles.length,
      } as never,
    })
    products = response.products
  } catch {
    return null
  }

  // Preserve recency order from the cookie, drop anything not returned.
  const indexed = new Map(products.map((p) => [p.handle ?? "", p]))
  const ordered = handles
    .map((h) => indexed.get(h))
    .filter(
      (p): p is HttpTypes.StoreProduct => Boolean(p)
    )

  if (ordered.length === 0) return null

  return (
    <section
      aria-label={title}
      className="content-container py-10 small:py-14"
    >
      <div className="mb-5 small:mb-7">
        <Text className="font-body text-xs uppercase tracking-[0.18em] text-[var(--arc-accent)]">
          Pour vous
        </Text>
        <Heading
          level="h2"
          className="font-display mt-2 text-2xl small:text-3xl text-arc-ink"
        >
          {title}
        </Heading>
      </div>
      <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-6 gap-3 small:gap-4">
        {ordered.map((product) => (
          <li key={product.id}>
            <ProductPreview product={product} region={region} />
          </li>
        ))}
      </ul>
    </section>
  )
}

export default RecentlyViewed
