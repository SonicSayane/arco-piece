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

  return (
    <div
      className="flex flex-col small:flex-row small:items-start py-6 content-container"
      data-testid="category-container"
    >
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
      <div className="w-full">
        <div className="mb-8 text-2xl-semi">
          <h1 data-testid="store-page-title">All products</h1>
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
  )
}

export default StoreTemplate
