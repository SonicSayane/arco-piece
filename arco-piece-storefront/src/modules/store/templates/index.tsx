import { Suspense } from "react"

import { listCategories } from "@lib/data/categories"
import { listAllProducts } from "@lib/data/products"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = async ({
  sortBy,
  page,
  category,
  vehicleBrand,
  model,
  year,
  countryCode,
}: {
  sortBy?: SortOptions
  page?: string
  category?: string
  vehicleBrand?: string
  model?: string
  year?: string
  countryCode: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  const [categories, productsResponse] = await Promise.all([
    listCategories(),
    listAllProducts({
      queryParams: { limit: 100 },
      countryCode,
    }),
  ])

  const categoryOptions = categories
    .filter((cat) => Boolean(cat.parent_category_id))
    .map((cat) => ({
      value: cat.id,
      label: cat.name,
    }))
    .sort((a, b) => a.label.localeCompare(b.label))

  const products = productsResponse.products

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

  const uniqueMetadataValues = (key: string) => {
    return Array.from(
      new Set(
        products
          .map((product) => readMetadataValue(product.metadata, key))
          .filter((value): value is string => Boolean(value))
      )
    ).sort((a, b) => a.localeCompare(b))
  }

  const vehicleBrandOptions = uniqueMetadataValues("vehicle_brand").map(
    (value) => ({ value, label: value })
  )
  const modelOptions = uniqueMetadataValues("model").map((value) => ({
    value,
    label: value,
  }))
  const yearOptions = uniqueMetadataValues("year").map((value) => ({
    value,
    label: value,
  }))

  const totalProducts = productsResponse.count

  return (
    <div className="content-container py-8 small:py-10" data-testid="category-container">
      <div className="grid grid-cols-1 small:grid-cols-[280px_1fr] gap-6">
        <RefinementList
          sortBy={sort}
          category={category}
          vehicleBrand={vehicleBrand}
          model={model}
          year={year}
          categoryOptions={categoryOptions}
          vehicleBrandOptions={vehicleBrandOptions}
          modelOptions={modelOptions}
          yearOptions={yearOptions}
        />

        <div className="arc-panel rounded-3xl p-5 small:p-8 w-full">
          <div className="mb-8 flex flex-col small:flex-row small:items-end small:justify-between gap-2">
            <div>
              <p className="font-body text-xs uppercase tracking-[0.15em] text-[var(--arc-accent)]">
                Catalogue
              </p>
              <h1
                className="font-display mt-2 text-3xl small:text-4xl text-arc-ink"
                data-testid="store-page-title"
              >
                Toutes les pieces
              </h1>
            </div>
            <p className="font-body text-sm text-arc-muted">
              {totalProducts} produit{totalProducts > 1 ? "s" : ""}
            </p>
          </div>

          <Suspense fallback={<SkeletonProductGrid />}>
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              categoryId={category}
              vehicleBrand={vehicleBrand}
              model={model}
              year={year}
              countryCode={countryCode}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default StoreTemplate
