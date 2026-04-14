"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

const DEFAULT_REGION = (process.env.NEXT_PUBLIC_DEFAULT_REGION || "ne").toLowerCase()
const SECONDARY_REGION =
  (process.env.NEXT_PUBLIC_SECONDARY_REGION || "fr").toLowerCase()

export const listRegions = async () => {
  const next = {
    ...(await getCacheOptions("regions")),
  }

  return sdk.client
    .fetch<{ regions: HttpTypes.StoreRegion[] }>(`/store/regions`, {
      method: "GET",
      next,
      cache: "force-cache",
    })
    .then(({ regions }) => regions)
    .catch(medusaError)
}

export const retrieveRegion = async (id: string) => {
  const next = {
    ...(await getCacheOptions(["regions", id].join("-"))),
  }

  return sdk.client
    .fetch<{ region: HttpTypes.StoreRegion }>(`/store/regions/${id}`, {
      method: "GET",
      next,
      cache: "force-cache",
    })
    .then(({ region }) => region)
    .catch(medusaError)
}

const regionMap = new Map<string, HttpTypes.StoreRegion>()

export const getRegion = async (countryCode: string) => {
  try {
    const normalizedCountryCode = countryCode?.toLowerCase()

    if (normalizedCountryCode && regionMap.has(normalizedCountryCode)) {
      return regionMap.get(normalizedCountryCode)
    }

    const regions = await listRegions()

    if (!regions) {
      return null
    }

    regions.forEach((region) => {
      region.countries?.forEach((c) => {
        regionMap.set(c?.iso_2 ?? "", region)
      })
    })

    const region =
      (normalizedCountryCode && regionMap.get(normalizedCountryCode)) ||
      regionMap.get(DEFAULT_REGION) ||
      regionMap.get(SECONDARY_REGION) ||
      regionMap.values().next().value

    return region
  } catch (e: any) {
    return null
  }
}
