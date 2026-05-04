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
  categoryOptions?: FilterOption[]
  vehicleBrandOptions?: FilterOption[]
  modelOptions?: FilterOption[]
  yearOptions?: FilterOption[]
  search?: boolean
  'data-testid'?: string
}

const RefinementList = ({
  sortBy,
  category,
  vehicleBrand,
  model,
  year,
  categoryOptions = [],
  vehicleBrandOptions = [],
  modelOptions = [],
  yearOptions = [],
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
    <aside className="arc-panel rounded-3xl p-5 small:p-6 h-fit small:sticky small:top-24">
      <p className="font-body text-xs uppercase tracking-[0.15em] text-[var(--arc-accent)] mb-4">
        Filtres
      </p>

      <div className="flex flex-col gap-y-5">
        <SortProducts sortBy={sortBy} setQueryParams={setQueryParams} data-testid={dataTestId} />

        <div className="border-t border-arc-divider pt-4">
          <FilterRadioGroup
            title="Categorie"
            items={[{ value: "", label: "Toutes" }, ...categoryOptions]}
            value={category || ""}
            handleChange={(value: string) => setQueryParams("category", value)}
          />
        </div>

        <div className="border-t border-arc-divider pt-4">
          <FilterRadioGroup
            title="Marque du vehicule"
            items={[{ value: "", label: "Toutes" }, ...vehicleBrandOptions]}
            value={vehicleBrand || ""}
            handleChange={(value: string) => setQueryParams("vehicle_brand", value)}
          />
        </div>

        <div className="border-t border-arc-divider pt-4">
          <FilterRadioGroup
            title="Modele"
            items={[{ value: "", label: "Tous" }, ...modelOptions]}
            value={model || ""}
            handleChange={(value: string) => setQueryParams("model", value)}
          />
        </div>

        <div className="border-t border-arc-divider pt-4">
          <FilterRadioGroup
            title="Annee"
            items={[{ value: "", label: "Toutes" }, ...yearOptions]}
            value={year || ""}
            handleChange={(value: string) => setQueryParams("year", value)}
          />
        </div>
      </div>
    </aside>
  )
}

export default RefinementList
