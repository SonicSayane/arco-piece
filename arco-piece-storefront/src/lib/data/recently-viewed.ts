"use server"

import { cookies as nextCookies } from "next/headers"

const COOKIE_NAME = "_arc_recent"
const MAX_HANDLES = 12

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
    maxAge: 60 * 60 * 24 * 60, // 60 days
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  })
}

export const getRecentlyViewedHandles = async (): Promise<string[]> => {
  return readHandles()
}

export const pushRecentlyViewed = async (handle: string): Promise<void> => {
  if (!handle) return
  const existing = await readHandles()
  const without = existing.filter((h) => h !== handle)
  await writeHandles([handle, ...without])
}
