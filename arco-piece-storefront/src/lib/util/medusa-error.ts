export default function medusaError(error: any): never {
  const toMessage = (value: unknown): string => {
    if (typeof value === "string") {
      return value
    }

    if (value && typeof value === "object") {
      const maybeMessage = (value as { message?: unknown }).message
      if (typeof maybeMessage === "string") {
        return maybeMessage
      }
    }

    return "An unknown error occurred"
  }

  const normalize = (message: string) => {
    if (!message) {
      return "An unknown error occurred."
    }

    const trimmed = message.trim()
    const punctuated = /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`
    return punctuated.charAt(0).toUpperCase() + punctuated.slice(1)
  }

  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const url = error?.config?.url
    const baseURL = error?.config?.baseURL

    if (url) {
      try {
        const resource = new URL(url, baseURL)
        console.error("Resource:", resource.toString())
      } catch {
        console.error("Resource:", url)
      }
    }

    console.error("Response data:", error.response.data)
    console.error("Status code:", error.response.status)
    console.error("Headers:", error.response.headers)

    // Extracting the error message from the response data
    const message = toMessage(error.response.data)

    throw new Error(normalize(message))
  }

  if (typeof error?.status === "number") {
    const message = toMessage(error?.message || error?.statusText)
    throw new Error(normalize(message))
  }

  if (error.request) {
    // The request was made but no response was received
    throw new Error("No response received from Medusa backend.")
  }

  const setupMessage = toMessage(error?.message)

  if (setupMessage.toLowerCase() === "fetch failed") {
    throw new Error(
      "Network error while contacting Medusa backend. Verify MEDUSA_BACKEND_URL and that the backend is running."
    )
  }

  // Something happened in setting up the request that triggered an Error
  throw new Error(`Error setting up the request: ${setupMessage}`)
}
