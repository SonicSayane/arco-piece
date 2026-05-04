import { getLocaleHeader } from "@lib/util/get-locale-header"
import Medusa, { FetchArgs, FetchInput } from "@medusajs/js-sdk"

// Defaults to standard port for Medusa server
let MEDUSA_BACKEND_URL = "http://localhost:9000"

if (process.env.MEDUSA_BACKEND_URL) {
  MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL
}

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})

const patchSdkFetch = (clientSdk: Medusa) => {
  const originalFetch = clientSdk.client.fetch.bind(clientSdk.client)

  clientSdk.client.fetch = async <T>(
    input: FetchInput,
    init?: FetchArgs
  ): Promise<T> => {
    const headers = new Headers(init?.headers as HeadersInit | undefined)

    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

    if (publishableKey && !headers.has("x-publishable-api-key")) {
      headers.set("x-publishable-api-key", publishableKey)
    }

    try {
      const localeHeader = await getLocaleHeader()
      const locale = localeHeader["x-medusa-locale"]

      if (locale && !headers.has("x-medusa-locale")) {
        headers.set("x-medusa-locale", locale)
      }
    } catch {}

    init = {
      ...init,
      headers: Object.fromEntries(headers.entries()),
    }

    return originalFetch(input, init)
  }

  return clientSdk
}

export const createSdk = () => {
  const clientSdk = new Medusa({
    baseUrl: MEDUSA_BACKEND_URL,
    debug: process.env.NODE_ENV === "development",
    publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
  })

  return patchSdkFetch(clientSdk)
}

patchSdkFetch(sdk)
