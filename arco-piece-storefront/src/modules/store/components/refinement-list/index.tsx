"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import FilterRadioGroup from "@modules/common/components/filter-radio-group"

import SortProducts, { SortOptions } from "./sort-products"

type FilterOption = {
  value: string
  label: string
}

type RefinementListProps = {
  sortBy: SortOptions
  category?: string
  vehicleBrand?: string
  model?: string
  year?: string
  categoryOptions: FilterOption[]
  vehicleBrandOptions: FilterOption[]
  modelOptions: FilterOption[]
  yearOptions: FilterOption[]
  search?: boolean
  'data-testid'?: string
}

const RefinementList = ({
  sortBy,
  category,
  vehicleBrand,
  model,
  year,
  categoryOptions,
  vehicleBrandOptions,
  modelOptions,
  yearOptions,
  'data-testid': dataTestId,
}: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)

      if (!value) {
        params.delete(name)
      } else {
        params.set(name, value)
      }

      params.delete("page")

      return params.toString()
    },
    [searchParams]
  )

  const setQueryParams = (name: string, value: string) => {
    const query = createQueryString(name, value)
    router.push(`${pathname}?${query}`)
  }

  return (
    <div className="flex small:flex-col gap-12 py-4 mb-8 small:px-0 pl-6 small:min-w-[250px] small:ml-[1.675rem]">
      <SortProducts sortBy={sortBy} setQueryParams={setQueryParams} data-testid={dataTestId} />
      <FilterRadioGroup
        title="Categorie"
        items={[{ value: "", label: "Toutes" }, ...categoryOptions]}
        value={category || ""}
        handleChange={(value: string) => setQueryParams("category", value)}
      />
      <FilterRadioGroup
        title="Marque du vehicule"
        items={[{ value: "", label: "Toutes" }, ...vehicleBrandOptions]}
        value={vehicleBrand || ""}
        handleChange={(value: string) => setQueryParams("vehicle_brand", value)}
      />
      <FilterRadioGroup
        title="Modele"
        items={[{ value: "", label: "Tous" }, ...modelOptions]}
        value={model || ""}
        handleChange={(value: string) => setQueryParams("model", value)}
      />
      <FilterRadioGroup
        title="Annee"
        items={[{ value: "", label: "Toutes" }, ...yearOptions]}
        value={year || ""}
        handleChange={(value: string) => setQueryParams("year", value)}
      />
    </div>
  )
}

export default RefinementList
