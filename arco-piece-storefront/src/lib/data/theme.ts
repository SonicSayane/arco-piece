"use server"

import { cookies as nextCookies } from "next/headers"

const COOKIE_NAME = "_arc_theme"
type Theme = "light" | "dark"

export const getTheme = async (): Promise<Theme> => {
  try {
    const cookies = await nextCookies()
    const value = cookies.get(COOKIE_NAME)?.value
    return value === "dark" ? "dark" : "light"
  } catch {
    return "light"
  }
}

export const setTheme = async (theme: Theme) => {
  const cookies = await nextCookies()
  cookies.set(COOKIE_NAME, theme, {
    maxAge: 60 * 60 * 24 * 365,
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  })
}
