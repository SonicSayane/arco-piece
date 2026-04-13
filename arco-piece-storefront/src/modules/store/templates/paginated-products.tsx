import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { sortProducts } from "@lib/util/sort-products"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

const PRODUCT_LIMIT = 12
const FILTER_FETCH_LIMIT = 100

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
}

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  vehicleBrand,
  model,
  year,
  productsIds,
  countryCode,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  vehicleBrand?: string
  model?: string
  year?: string
  productsIds?: string[]
  countryCode: string
}) {
  const queryParams: PaginatedProductsParams = {
    limit: FILTER_FETCH_LIMIT,
  }

  if (collectionId) {
    queryParams["collection_id"] = [collectionId]
  }

  if (categoryId) {
    queryParams["category_id"] = [categoryId]
  }

  if (productsIds) {
    queryParams["id"] = productsIds
  }

  if (sortBy === "created_at") {
    queryParams["order"] = "created_at"
  }

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const {
    response: { products: fetchedProducts },
  } = await listProducts({
    pageParam: 1,
    queryParams,
    countryCode,
  })

  const readMetadataValue = (metadata: unknown, key: string): string | null => {
    if (!metadata || typeof metadata !== "object") {
      return null
    }

    const value = (metadata as Record<string, unknown>)[key]

    if (typeof value === "string" || typeof value === "number") {
      return String(value)
    }

    return null
  }

  const metadataFilteredProducts = fetchedProducts.filter((product) => {
    const metadata = product.metadata

    if (
      vehicleBrand &&
      readMetadataValue(metadata, "vehicle_brand") !== vehicleBrand
    ) {
      return false
    }

    if (model && readMetadataValue(metadata, "model") !== model) {
      return false
    }

    if (year && readMetadataValue(metadata, "year") !== year) {
      return false
    }

    return true
  })

  const sortedProducts = sortProducts(
    metadataFilteredProducts,
    sortBy || "created_at"
  )

  const offset = (page - 1) * PRODUCT_LIMIT
  const products = sortedProducts.slice(offset, offset + PRODUCT_LIMIT)
  const count = sortedProducts.length

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  return (
    <>
      <ul
        className="grid grid-cols-2 w-full small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8"
        data-testid="products-list"
      >
        {products.map((p) => {
          return (
            <li key={p.id}>
              <ProductPreview product={p} region={region} />
            </li>
          )
        })}
      </ul>
      {totalPages > 1 && (
        <Pagination
          data-testid="product-pagination"
          page={page}
          totalPages={totalPages}
        />
      )}
    </>
  )
}
