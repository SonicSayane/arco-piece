"use server"

import { sdk } from "@lib/config"
import { sortProducts } from "@lib/util/sort-products"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { getAuthHeaders } from "./cookies"
import { getRegion, retrieveRegion } from "./regions"

const DEFAULT_LIST_PAGE_SIZE = 100
const MAX_LIST_PAGES = 50

type ProductListQueryParams =
  HttpTypes.FindParams & HttpTypes.StoreProductListParams

export const listProducts = async ({
  pageParam = 1,
  queryParams,
  countryCode,
  regionId,
}: {
  pageParam?: number
  queryParams?: ProductListQueryParams
  countryCode?: string
  regionId?: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: ProductListQueryParams
}> => {
  if (!countryCode && !regionId) {
    throw new Error("Country code or region ID is required")
  }

  const limit = queryParams?.limit || 12
  const _pageParam = Math.max(pageParam, 1)
  const offset = _pageParam === 1 ? 0 : (_pageParam - 1) * limit

  let region: HttpTypes.StoreRegion | undefined | null

  if (countryCode) {
    region = await getRegion(countryCode)
  } else {
    region = await retrieveRegion(regionId!)
  }

  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[]; count: number }>(
      `/store/products`,
      {
        method: "GET",
        query: {
          limit,
          offset,
          region_id: region?.id,
          fields:
            "*variants.calculated_price,+variants.inventory_quantity,*variants.images,+metadata,+tags,",
          ...queryParams,
        },
        headers,
        cache: "no-store",
      }
    )
    .then(({ products, count }) => {
      const nextPage = count > offset + limit ? pageParam + 1 : null

      return {
        response: {
          products,
          count,
        },
        nextPage: nextPage,
        queryParams,
      }
    })
}

export const listAllProducts = async ({
  queryParams,
  countryCode,
  regionId,
}: {
  queryParams?: ProductListQueryParams
  countryCode?: string
  regionId?: string
}): Promise<{ products: HttpTypes.StoreProduct[]; count: number }> => {
  if (!countryCode && !regionId) {
    throw new Error("Country code or region ID is required")
  }

  const pageSize = queryParams?.limit || DEFAULT_LIST_PAGE_SIZE
  const allProducts: HttpTypes.StoreProduct[] = []
  let totalCount = 0
  let pageParam = 1

  for (let currentPage = 0; currentPage < MAX_LIST_PAGES; currentPage++) {
    const { response, nextPage } = await listProducts({
      pageParam,
      queryParams: {
        ...queryParams,
        limit: pageSize,
      },
      countryCode,
      regionId,
    })

    allProducts.push(...response.products)
    totalCount = response.count

    if (!nextPage) {
      break
    }

    pageParam = nextPage
  }

  return {
    products: allProducts,
    count: totalCount || allProducts.length,
  }
}

/**
 * This fetches all products (paginated) and sorts them based on the sortBy parameter.
 * It will then return the paginated products based on the page and limit parameters.
 */
export const listProductsWithSort = async ({
  page = 0,
  queryParams,
  sortBy = "created_at",
  countryCode,
}: {
  page?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  sortBy?: SortOptions
  countryCode: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> => {
  const limit = queryParams?.limit || 12

  const { products, count } = await listAllProducts({
    queryParams: {
      ...queryParams,
      limit: DEFAULT_LIST_PAGE_SIZE,
    },
    countryCode,
  })

  const sortedProducts = sortProducts(products, sortBy)

  const pageParam = (page - 1) * limit

  const nextPage = count > pageParam + limit ? pageParam + limit : null

  const paginatedProducts = sortedProducts.slice(pageParam, pageParam + limit)

  return {
    response: {
      products: paginatedProducts,
      count,
    },
    nextPage,
    queryParams,
  }
}
