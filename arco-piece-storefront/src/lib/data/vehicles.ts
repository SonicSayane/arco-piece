"use server"

import { cookies as nextCookies } from "next/headers"
import { revalidatePath } from "next/cache"

const COOKIE_NAME = "_arc_vehicles"
const MAX_VEHICLES = 5

export type SavedVehicle = {
  id: string
  brand: string
  model?: string
  year?: string
}

const isVehicle = (v: unknown): v is SavedVehicle => {
  if (!v || typeof v !== "object") return false
  const obj = v as Partial<SavedVehicle>
  return typeof obj.id === "string" && typeof obj.brand === "string"
}

const readVehicles = async (): Promise<SavedVehicle[]> => {
  try {
    const cookies = await nextCookies()
    const raw = cookies.get(COOKIE_NAME)?.value
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isVehicle).slice(0, MAX_VEHICLES)
  } catch {
    return []
  }
}

const writeVehicles = async (vehicles: SavedVehicle[]) => {
  const cookies = await nextCookies()
  cookies.set(COOKIE_NAME, JSON.stringify(vehicles.slice(0, MAX_VEHICLES)), {
    maxAge: 60 * 60 * 24 * 365,
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  })
}

const makeId = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return `v_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

export const getVehicles = async (): Promise<SavedVehicle[]> => {
  return readVehicles()
}

export const getActiveVehicle = async (): Promise<SavedVehicle | null> => {
  const list = await readVehicles()
  return list[0] ?? null
}

const sanitize = (raw: FormDataEntryValue | null): string | undefined => {
  if (typeof raw !== "string") return undefined
  const trimmed = raw.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

export type VehicleActionState = {
  success: boolean
  error: string | null
}

export const addVehicle = async (
  _state: VehicleActionState,
  formData: FormData
): Promise<VehicleActionState> => {
  const brand = sanitize(formData.get("brand"))
  const model = sanitize(formData.get("model"))
  const year = sanitize(formData.get("year"))

  if (!brand) {
    return { success: false, error: "Marque requise." }
  }

  const list = await readVehicles()

  // Dedupe on (brand+model+year) — moves an existing match to the front.
  const without = list.filter(
    (v) =>
      v.brand.toLowerCase() !== brand.toLowerCase() ||
      (v.model ?? "").toLowerCase() !== (model ?? "").toLowerCase() ||
      (v.year ?? "") !== (year ?? "")
  )

  const next: SavedVehicle = {
    id: makeId(),
    brand,
    ...(model ? { model } : {}),
    ...(year ? { year } : {}),
  }

  await writeVehicles([next, ...without])
  revalidatePath("/[countryCode]/account/vehicles", "page")

  return { success: true, error: null }
}

export const removeVehicle = async (id: string): Promise<void> => {
  const list = await readVehicles()
  await writeVehicles(list.filter((v) => v.id !== id))
  revalidatePath("/[countryCode]/account/vehicles", "page")
}

export const promoteVehicle = async (id: string): Promise<void> => {
  const list = await readVehicles()
  const target = list.find((v) => v.id === id)
  if (!target) return
  const without = list.filter((v) => v.id !== id)
  await writeVehicles([target, ...without])
  revalidatePath("/[countryCode]/account/vehicles", "page")
}
