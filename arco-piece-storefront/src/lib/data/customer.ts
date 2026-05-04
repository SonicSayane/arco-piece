"use server"

import { createSdk, sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import {
  FieldErrors,
  parseCountryCode,
  validateLogin,
  validateSignup,
} from "@lib/util/form-validation"
import { HttpTypes } from "@medusajs/types"
import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import {
  getAuthHeaders,
  getCacheTag,
  getCartId,
  removeAuthToken,
  removeCartId,
  removeCustomerName,
  setCustomerName,
  setAuthToken,
} from "./cookies"

export type AuthActionState = {
  message: string | null
  errors?: FieldErrors
} | null

const GENERIC_ERROR_MESSAGE =
  "Une erreur inattendue est survenue. Veuillez réessayer."

const hasStatus = (value: unknown): value is { status: number } =>
  typeof value === "object" &&
  value !== null &&
  "status" in value &&
  typeof (value as { status: unknown }).status === "number"

const hasResponseStatus = (
  value: unknown
): value is { response: { status: number } } =>
  typeof value === "object" &&
  value !== null &&
  "response" in value &&
  typeof (value as { response?: unknown }).response === "object" &&
  (value as { response: { status?: unknown } }).response !== null &&
  typeof (value as { response: { status?: unknown } }).response.status ===
    "number"

const getErrorStatus = (error: unknown): number | undefined => {
  if (hasStatus(error)) {
    return error.status
  }

  if (hasResponseStatus(error)) {
    return error.response.status
  }

  return undefined
}

const logServerError = (context: string, error: unknown) => {
  if (process.env.NODE_ENV !== "production") {
    console.error(`[customer] ${context}:`, error)
    return
  }

  const status = getErrorStatus(error)
  console.error(
    `[customer] ${context} (status=${status ?? "unknown"})`
  )
}

const getCustomerDisplayName = (customer: {
  first_name?: string | null
  last_name?: string | null
  email?: string | null
}) => {
  return (
    `${customer.first_name ?? ""} ${customer.last_name ?? ""}`.trim() ||
    customer.email?.split("@")[0] ||
    "Compte"
  )
}

const getAccountRedirectPath = (formData: FormData) => {
  const countryCode = parseCountryCode(formData)
  return countryCode ? `/${countryCode}/account` : "/account"
}

const getTokenFromAuthResult = (
  result: string | { location: string }
): string | null => {
  if (typeof result === "string") {
    return result
  }

  if (result && typeof result === "object" && result.location) {
    redirect(result.location)
  }

  return null
}

const clearAuthCookies = async () => {
  await removeAuthToken().catch(() => undefined)
  await removeCustomerName().catch(() => undefined)
}

const isNextRedirectError = (error: unknown): boolean => {
  if (!error || typeof error !== "object") return false
  const digest = (error as { digest?: unknown }).digest
  return typeof digest === "string" && digest.startsWith("NEXT_REDIRECT")
}

const fail = (
  message: string,
  errors?: FieldErrors
): AuthActionState => ({
  message,
  ...(errors ? { errors } : {}),
})

export const retrieveCustomer =
  async (): Promise<HttpTypes.StoreCustomer | null> => {
    const requestSdk = createSdk()
    const authHeaders = await getAuthHeaders()

    if (!("authorization" in authHeaders)) {
      return null
    }

    return await requestSdk.client
      .fetch<{ customer: HttpTypes.StoreCustomer }>(`/store/customers/me`, {
        method: "GET",
        query: {
          fields: "*orders",
        },
        headers: { ...authHeaders },
        cache: "no-store",
      })
      .then(({ customer }) => customer)
      .catch(() => null)
  }

export const updateCustomer = async (body: HttpTypes.StoreUpdateCustomer) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const updateRes = await sdk.store.customer
    .update(body, {}, headers)
    .then(({ customer }) => customer)
    .catch(medusaError)

  if (updateRes) {
    await setCustomerName(getCustomerDisplayName(updateRes))
  }

  const cacheTag = await getCacheTag("customers")
  if (cacheTag) {
    revalidateTag(cacheTag)
  }

  return updateRes
}

export async function signup(
  _currentState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const validation = validateSignup(formData)

  if (!validation.success) {
    return fail(validation.message, validation.errors)
  }

  const authSdk = createSdk()
  const accountPath = getAccountRedirectPath(formData)
  const { email, password, first_name, last_name, phone } = validation.data

  let loginAuthorization = ""

  try {
    const registerResult = await authSdk.auth.register("customer", "emailpass", {
      email,
      password,
    })

    const registeredToken = getTokenFromAuthResult(registerResult)

    if (!registeredToken) {
      return fail("Authentification supplémentaire requise.")
    }

    await setAuthToken(registeredToken)

    const { customer: createdCustomer } = await authSdk.store.customer.create(
      {
        email,
        first_name,
        last_name,
        ...(phone ? { phone } : {}),
      },
      {},
      { authorization: `Bearer ${registeredToken}` }
    )

    await setCustomerName(getCustomerDisplayName(createdCustomer))

    const loginResult = await authSdk.auth.login("customer", "emailpass", {
      email,
      password,
    })

    const loginToken = getTokenFromAuthResult(loginResult)

    if (!loginToken) {
      await clearAuthCookies()
      return fail("Authentification supplémentaire requise.")
    }

    await setAuthToken(loginToken)
    loginAuthorization = `Bearer ${loginToken}`

    const customerCacheTag = await getCacheTag("customers")
    if (customerCacheTag) {
      revalidateTag(customerCacheTag)
    }
  } catch (error) {
    // Don't swallow Next.js navigation signals (e.g. when getTokenFromAuthResult
    // calls redirect() for an OAuth/SSO flow).
    if (isNextRedirectError(error)) {
      throw error
    }

    logServerError("signup", error)

    // Best-effort rollback: clear any partial auth state the registration may
    // have created so the user is not left with an orphaned session.
    await clearAuthCookies()

    const status = getErrorStatus(error)

    if (status === 401) {
      return fail("Identifiants invalides.", { email: "Identifiants invalides." })
    }

    if (status === 409 || status === 422) {
      return fail("Un compte existe déjà avec cet email.", {
        email: "Un compte existe déjà avec cet email.",
      })
    }

    return fail(GENERIC_ERROR_MESSAGE)
  }

  try {
    if (loginAuthorization) {
      await transferCart({ authorization: loginAuthorization })
    }
  } catch (error) {
    // Login/signup should not fail when cart transfer is stale/invalid.
    logServerError("signup.transferCart", error)
  }

  redirect(accountPath)
}

export async function login(
  _currentState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const validation = validateLogin(formData)

  if (!validation.success) {
    return fail(validation.message, validation.errors)
  }

  const authSdk = createSdk()
  const accountPath = getAccountRedirectPath(formData)
  const { email, password } = validation.data
  const emailPrefix = email.split("@")[0] || "Compte"

  let loginAuthorization = ""

  try {
    const loginResult = await authSdk.auth.login("customer", "emailpass", {
      email,
      password,
    })

    const token = getTokenFromAuthResult(loginResult)

    if (!token) {
      return fail("Authentification supplémentaire requise.")
    }

    await setAuthToken(token)
    await setCustomerName(emailPrefix)
    loginAuthorization = `Bearer ${token}`

    const meResponse = await authSdk.client
      .fetch<{ customer: HttpTypes.StoreCustomer }>(`/store/customers/me`, {
        method: "GET",
        headers: { authorization: loginAuthorization },
        cache: "no-store",
      })
      .catch(() => null)

    if (!meResponse?.customer) {
      await clearAuthCookies()
      return fail("Connexion établie mais session invalide. Réessayez.")
    }

    await setCustomerName(getCustomerDisplayName(meResponse.customer))

    const customerCacheTag = await getCacheTag("customers")
    if (customerCacheTag) {
      revalidateTag(customerCacheTag)
    }
  } catch (error) {
    // Don't swallow Next.js navigation signals.
    if (isNextRedirectError(error)) {
      throw error
    }

    logServerError("login", error)

    const status = getErrorStatus(error)

    if (status === 401) {
      return fail("Email ou mot de passe invalide.", {
        email: "Email ou mot de passe invalide.",
        password: "Email ou mot de passe invalide.",
      })
    }

    return fail(GENERIC_ERROR_MESSAGE)
  }

  try {
    if (loginAuthorization) {
      await transferCart({ authorization: loginAuthorization })
    }
  } catch (error) {
    // Best effort only. User is already authenticated.
    logServerError("login.transferCart", error)
  }

  redirect(accountPath)
}

export async function signout(countryCode: string) {
  const authSdk = createSdk()

  await authSdk.auth.logout().catch((error) => {
    logServerError("signout", error)
  })

  await removeAuthToken()
  await removeCustomerName()
  await removeCartId()

  const customerCacheTag = await getCacheTag("customers")
  if (customerCacheTag) {
    revalidateTag(customerCacheTag)
  }

  const cartCacheTag = await getCacheTag("carts")
  if (cartCacheTag) {
    revalidateTag(cartCacheTag)
  }

  redirect(`/${countryCode || ""}/account`)
}

export async function transferCart(authHeadersOverride?: {
  authorization: string
}) {
  const requestSdk = createSdk()
  const cartId = await getCartId()

  if (!cartId) {
    return
  }

  const resolvedHeaders = authHeadersOverride ?? (await getAuthHeaders())

  const authorization =
    "authorization" in resolvedHeaders
      ? (resolvedHeaders as { authorization: string }).authorization
      : null

  if (!authorization) {
    return
  }

  const headers = { authorization }

  try {
    await requestSdk.store.cart.transferCart(cartId, {}, headers)
  } catch (error) {
    if (isNextRedirectError(error)) {
      throw error
    }

    const status = getErrorStatus(error)

    if (status === 401 || status === 404 || status === 409) {
      await removeCartId()
      const cartCacheTag = await getCacheTag("carts")
      if (cartCacheTag) {
        revalidateTag(cartCacheTag)
      }
      return
    }

    throw error
  }

  const cartCacheTag = await getCacheTag("carts")
  if (cartCacheTag) {
    revalidateTag(cartCacheTag)
  }
}

export type AddressActionState = {
  success: boolean
  error: string | null
}

export const addCustomerAddress = async (
  currentState: Record<string, unknown>,
  formData: FormData
): Promise<AddressActionState> => {
  const isDefaultBilling = (currentState.isDefaultBilling as boolean) || false
  const isDefaultShipping = (currentState.isDefaultShipping as boolean) || false

  const address = {
    first_name: (formData.get("first_name") as string) ?? "",
    last_name: (formData.get("last_name") as string) ?? "",
    company: (formData.get("company") as string) ?? "",
    address_1: (formData.get("address_1") as string) ?? "",
    address_2: (formData.get("address_2") as string) ?? "",
    city: (formData.get("city") as string) ?? "",
    postal_code: (formData.get("postal_code") as string) ?? "",
    province: (formData.get("province") as string) ?? "",
    country_code: (formData.get("country_code") as string) ?? "",
    phone: (formData.get("phone") as string) ?? "",
    is_default_billing: isDefaultBilling,
    is_default_shipping: isDefaultShipping,
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.customer
    .createAddress(address, {}, headers)
    .then(async () => {
      const customerCacheTag = await getCacheTag("customers")
      if (customerCacheTag) {
        revalidateTag(customerCacheTag)
      }
      return { success: true, error: null }
    })
    .catch((err: unknown) => {
      logServerError("addCustomerAddress", err)
      return { success: false, error: GENERIC_ERROR_MESSAGE }
    })
}

export const deleteCustomerAddress = async (
  addressId: string
): Promise<AddressActionState> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.customer
    .deleteAddress(addressId, headers)
    .then(async () => {
      const customerCacheTag = await getCacheTag("customers")
      if (customerCacheTag) {
        revalidateTag(customerCacheTag)
      }
      return { success: true, error: null }
    })
    .catch((err: unknown) => {
      logServerError("deleteCustomerAddress", err)
      return { success: false, error: GENERIC_ERROR_MESSAGE }
    })
}

export const updateCustomerAddress = async (
  currentState: Record<string, unknown>,
  formData: FormData
): Promise<AddressActionState> => {
  const addressId =
    (currentState.addressId as string) || (formData.get("addressId") as string)

  if (!addressId) {
    return { success: false, error: "Address ID is required" }
  }

  const address = {
    first_name: (formData.get("first_name") as string) ?? "",
    last_name: (formData.get("last_name") as string) ?? "",
    company: (formData.get("company") as string) ?? "",
    address_1: (formData.get("address_1") as string) ?? "",
    address_2: (formData.get("address_2") as string) ?? "",
    city: (formData.get("city") as string) ?? "",
    postal_code: (formData.get("postal_code") as string) ?? "",
    province: (formData.get("province") as string) ?? "",
    country_code: (formData.get("country_code") as string) ?? "",
  } as HttpTypes.StoreUpdateCustomerAddress

  const phone = formData.get("phone") as string

  if (phone) {
    address.phone = phone
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.customer
    .updateAddress(addressId, address, {}, headers)
    .then(async () => {
      const customerCacheTag = await getCacheTag("customers")
      if (customerCacheTag) {
        revalidateTag(customerCacheTag)
      }
      return { success: true, error: null }
    })
    .catch((err: unknown) => {
      logServerError("updateCustomerAddress", err)
      return { success: false, error: GENERIC_ERROR_MESSAGE }
    })
}
