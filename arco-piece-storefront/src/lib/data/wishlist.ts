"use server"

import { cookies as nextCookies } from "next/headers"
import { revalidatePath } from "next/cache"

const COOKIE_NAME = "_arc_wishlist"
const MAX_HANDLES = 50

const readHandles = async (): Promise<string[]> => {
  try {
    const cookies = await nextCookies()
    const raw = cookies.get(COOKIE_NAME)?.value
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((h): h is string => typeof h === "string" && h.length > 0)
      .slice(0, MAX_HANDLES)
  } catch {
    return []
  }
}

const writeHandles = async (handles: string[]) => {
  const cookies = await nextCookies()
  cookies.set(COOKIE_NAME, JSON.stringify(handles.slice(0, MAX_HANDLES)), {
    maxAge: 60 * 60 * 24 * 365,
    httpOnly: false, // readable by client for optimistic UI
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  })
}

export const getWishlistHandles = async (): Promise<string[]> => {
  return readHandles()
}

export const isInWishlist = async (handle: string): Promise<boolean> => {
  const handles = await readHandles()
  return handles.includes(handle)
}

export const toggleWishlist = async (
  handle: string
): Promise<{ inWishlist: boolean; count: number }> => {
  const handles = await readHandles()
  const index = handles.indexOf(handle)

  let next: string[]
  let inWishlist: boolean

  if (index === -1) {
    next = [handle, ...handles]
    inWishlist = true
  } else {
    next = handles.filter((_, i) => i !== index)
    inWishlist = false
  }

  await writeHandles(next)
  revalidatePath("/[countryCode]/account/wishlist", "page")

  return { inWishlist, count: next.length }
}

export const clearWishlist = async () => {
  await writeHandles([])
  revalidatePath("/[countryCode]/account/wishlist", "page")
}
