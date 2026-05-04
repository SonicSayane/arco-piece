import "server-only"

import fr, { type Dict } from "./dictionaries/fr"
import en from "./dictionaries/en"
import { getLocale } from "@lib/data/locale-actions"

export type { Dict }

export const SUPPORTED_LOCALES = ["fr", "en"] as const
export type Locale = (typeof SUPPORTED_LOCALES)[number]

const dictionaries: Record<Locale, Dict> = {
  fr,
  en,
}

const normalize = (raw: string | null | undefined): Locale => {
  if (!raw) return "fr"
  const lower = raw.toLowerCase().slice(0, 2)
  return SUPPORTED_LOCALES.includes(lower as Locale) ? (lower as Locale) : "fr"
}

export const getDict = async (): Promise<Dict> => {
  const raw = await getLocale()
  return dictionaries[normalize(raw)]
}

export const getActiveLocale = async (): Promise<Locale> => {
  const raw = await getLocale()
  return normalize(raw)
}
