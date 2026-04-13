import { Metadata } from "next"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"

export const metadata: Metadata = {
  title: "Store",
  description: "Explore all of our products.",
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
    category?: string
    vehicle_brand?: string
    model?: string
    year?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { sortBy, page, category, vehicle_brand, model, year } = searchParams

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      category={category}
      vehicleBrand={vehicle_brand}
      model={model}
      year={year}
      countryCode={params.countryCode}
    />
  )
}
