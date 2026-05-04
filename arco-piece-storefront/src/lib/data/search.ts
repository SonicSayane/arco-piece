"use server"

import { listProducts } from "./products"

export type SearchSuggestion = {
  id: string
  title: string
  handle: string
  thumbnail: string | null
}

export const searchProducts = async ({
  query,
  countryCode,
  limit = 6,
}: {
  query: string
  countryCode: string
  limit?: number
}): Promise<SearchSuggestion[]> => {
  const trimmed = query.trim()
  if (!trimmed) return []

  try {
    const { response } = await listProducts({
      countryCode,
      queryParams: {
        q: trimmed,
        limit,
        fields: "id,title,handle,thumbnail",
      } as never,
    })

    return response.products.map((p) => ({
      id: p.id,
      title: p.title ?? "",
      handle: p.handle ?? "",
      thumbnail: p.thumbnail ?? null,
    }))
  } catch {
    return []
  }
}
