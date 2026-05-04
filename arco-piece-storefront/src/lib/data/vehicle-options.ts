"use server"

import { listAllProducts } from "./products"

export type VehicleOptions = {
  brands: string[]
  modelsByBrand: Record<string, string[]>
  yearsByBrandModel: Record<string, string[]>
}

const readMetadataValue = (
  metadata: unknown,
  key: string
): string | null => {
  if (!metadata || typeof metadata !== "object") return null
  const value = (metadata as Record<string, unknown>)[key]
  if (typeof value === "string" || typeof value === "number") {
    return String(value).trim() || null
  }
  return null
}

const sortNatural = (a: string, b: string) =>
  a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })

export const getVehicleOptions = async ({
  countryCode,
}: {
  countryCode: string
}): Promise<VehicleOptions> => {
  try {
    const { products } = await listAllProducts({
      countryCode,
      queryParams: { limit: 200, fields: "id,metadata" } as never,
    })

    const modelsByBrand: Record<string, Set<string>> = {}
    const yearsByBrandModel: Record<string, Set<string>> = {}
    const brands = new Set<string>()

    for (const product of products) {
      const brand = readMetadataValue(product.metadata, "vehicle_brand")
      const model = readMetadataValue(product.metadata, "model")
      const year = readMetadataValue(product.metadata, "year")

      if (brand) {
        brands.add(brand)
        if (model) {
          modelsByBrand[brand] ??= new Set()
          modelsByBrand[brand].add(model)
          if (year) {
            const key = `${brand}|${model}`
            yearsByBrandModel[key] ??= new Set()
            yearsByBrandModel[key].add(year)
          }
        }
      }
    }

    return {
      brands: Array.from(brands).sort(sortNatural),
      modelsByBrand: Object.fromEntries(
        Object.entries(modelsByBrand).map(([k, v]) => [
          k,
          Array.from(v).sort(sortNatural),
        ])
      ),
      yearsByBrandModel: Object.fromEntries(
        Object.entries(yearsByBrandModel).map(([k, v]) => [
          k,
          Array.from(v).sort((a, b) => sortNatural(b, a)),
        ])
      ),
    }
  } catch {
    return {
      brands: [],
      modelsByBrand: {},
      yearsByBrandModel: {},
    }
  }
}
