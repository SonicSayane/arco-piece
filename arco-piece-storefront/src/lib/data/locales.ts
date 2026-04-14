"use server"

import { sdk } from "@lib/config"
import { getCacheOptions } from "./cookies"

export type Locale = {
  code: string
  name: string
}

const ENABLE_STOREFRONT_LOCALES =
  process.env.NEXT_PUBLIC_ENABLE_LOCALES === "true"

/**
 * Fetches available locales from the backend.
 * Returns null if the endpoint returns 404 (locales not configured).
 */
export const listLocales = async (): Promise<Locale[] | null> => {
  if (!ENABLE_STOREFRONT_LOCALES) {
    return null
  }

  const next = {
    ...(await getCacheOptions("locales")),
  }

  return sdk.client
    .fetch<{ locales: Locale[] }>(`/store/locales`, {
      method: "GET",
      next,
      cache: "force-cache",
    })
    .then(({ locales }) => locales)
    .catch(() => null)
}
