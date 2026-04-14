import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

import InteractiveLink from "@modules/common/components/interactive-link"
import ProductPreview from "@modules/products/components/product-preview"

export default async function ProductRail({
  collection,
  region,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: collection.id,
      fields: "*variants.calculated_price",
    },
  })

  if (!pricedProducts) {
    return null
  }

  return (
    <div className="content-container py-8 small:py-10">
      <div className="arc-panel rounded-3xl px-5 py-8 small:px-8 small:py-10">
        <div className="flex items-end justify-between mb-7">
          <Text className="font-display text-2xl small:text-3xl text-arc-ink">
            {collection.title}
          </Text>
          <InteractiveLink href={`/collections/${collection.handle}`}>
            Voir tout
          </InteractiveLink>
        </div>

        <ul className="grid grid-cols-1 small:grid-cols-2 medium:grid-cols-3 gap-x-6 gap-y-10 small:gap-y-12">
          {pricedProducts &&
            pricedProducts.map((product) => (
              <li key={product.id}>
                <ProductPreview product={product} region={region} isFeatured />
              </li>
            ))}
        </ul>
      </div>
    </div>
  )
}
