"use client"

import ArcButton from "@modules/common/components/arc-button"
import type { VehicleOptions } from "@lib/data/vehicle-options"
import type { SavedVehicle } from "@lib/data/vehicles"
import { useParams, useRouter } from "next/navigation"
import { useMemo, useState } from "react"

type Props = {
  options: VehicleOptions
  defaults?: SavedVehicle | null
}

const VehicleFinder = ({ options, defaults }: Props) => {
  const router = useRouter()
  const params = useParams<{ countryCode?: string }>()
  const countryCode =
    typeof params?.countryCode === "string" ? params.countryCode : ""

  const [brand, setBrand] = useState(() =>
    defaults && options.brands.includes(defaults.brand) ? defaults.brand : ""
  )
  const [model, setModel] = useState(() => {
    if (!defaults?.brand || !defaults?.model) return ""
    const list = options.modelsByBrand[defaults.brand] ?? []
    return list.includes(defaults.model) ? defaults.model : ""
  })
  const [year, setYear] = useState(() => {
    if (!defaults?.brand || !defaults?.model || !defaults?.year) return ""
    const list =
      options.yearsByBrandModel[`${defaults.brand}|${defaults.model}`] ?? []
    return list.includes(defaults.year) ? defaults.year : ""
  })

  const models = useMemo(
    () => (brand ? options.modelsByBrand[brand] ?? [] : []),
    [brand, options.modelsByBrand]
  )
  const years = useMemo(
    () =>
      brand && model
        ? options.yearsByBrandModel[`${brand}|${model}`] ?? []
        : [],
    [brand, model, options.yearsByBrandModel]
  )

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!countryCode) return

    const search = new URLSearchParams()
    if (brand) search.set("vehicle_brand", brand)
    if (model) search.set("model", model)
    if (year) search.set("year", year)

    const qs = search.toString()
    router.push(`/${countryCode}/store${qs ? `?${qs}` : ""}`)
  }

  if (options.brands.length === 0) {
    return null
  }

  return (
    <form
      onSubmit={onSubmit}
      className="content-container relative -mt-6 small:-mt-10 mb-10"
      aria-label="Trouver les pièces compatibles avec mon véhicule"
    >
      <div className="rounded-3xl border border-arc-divider bg-arc-surface p-4 small:p-5 shadow-[0_10px_25px_rgba(15,23,42,0.08)]">
        <p className="font-body text-xs uppercase tracking-[0.18em] text-[var(--arc-accent)]">
          Trouver mon véhicule
        </p>
        <div className="mt-3 grid grid-cols-1 small:grid-cols-[1fr_1fr_1fr_auto] gap-3 small:gap-2 small:items-end">
          <label className="flex flex-col gap-1">
            <span className="font-body text-xs text-arc-muted">Marque</span>
            <select
              value={brand}
              onChange={(e) => {
                setBrand(e.target.value)
                setModel("")
                setYear("")
              }}
              className="h-10 rounded-md border border-arc-divider bg-arc-surface px-3 text-sm focus:outline-none focus:border-[var(--arc-accent)]"
            >
              <option value="">Toutes les marques</option>
              {options.brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="font-body text-xs text-arc-muted">Modèle</span>
            <select
              value={model}
              onChange={(e) => {
                setModel(e.target.value)
                setYear("")
              }}
              disabled={!brand || models.length === 0}
              className="h-10 rounded-md border border-arc-divider bg-arc-surface px-3 text-sm focus:outline-none focus:border-[var(--arc-accent)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <option value="">
                {brand ? "Tous les modèles" : "Choisir une marque"}
              </option>
              {models.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="font-body text-xs text-arc-muted">Année</span>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              disabled={!model || years.length === 0}
              className="h-10 rounded-md border border-arc-divider bg-arc-surface px-3 text-sm focus:outline-none focus:border-[var(--arc-accent)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <option value="">
                {model ? "Toutes les années" : "Choisir un modèle"}
              </option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>

          <ArcButton type="submit" variant="primary" className="h-10">
            Rechercher
          </ArcButton>
        </div>
      </div>
    </form>
  )
}

export default VehicleFinder
