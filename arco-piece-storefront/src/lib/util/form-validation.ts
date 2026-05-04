import "server-only"

export type FieldErrors = Record<string, string>

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: FieldErrors; message: string }

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const COUNTRY_CODE_REGEX = /^[a-z]{2}$/
const MIN_PASSWORD_LENGTH = 8

const readString = (formData: FormData, key: string): string => {
  const raw = formData.get(key)
  return typeof raw === "string" ? raw.trim() : ""
}

const readOptionalString = (
  formData: FormData,
  key: string
): string | undefined => {
  const value = readString(formData, key)
  return value.length > 0 ? value : undefined
}

export const parseCountryCode = (formData: FormData): string | undefined => {
  const raw = readString(formData, "country_code").toLowerCase()
  return COUNTRY_CODE_REGEX.test(raw) ? raw : undefined
}

export type LoginInput = {
  email: string
  password: string
}

export const validateLogin = (formData: FormData): ValidationResult<LoginInput> => {
  const errors: FieldErrors = {}
  const email = readString(formData, "email").toLowerCase()
  const password = readString(formData, "password")

  if (!email) {
    errors.email = "Email requis."
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = "Email invalide."
  }

  if (!password) {
    errors.password = "Mot de passe requis."
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      errors,
      message: "Veuillez corriger les champs indiqués.",
    }
  }

  return { success: true, data: { email, password } }
}

export type SignupInput = {
  email: string
  password: string
  first_name: string
  last_name: string
  phone?: string
}

export const validateSignup = (formData: FormData): ValidationResult<SignupInput> => {
  const errors: FieldErrors = {}
  const email = readString(formData, "email").toLowerCase()
  const password = readString(formData, "password")
  const passwordConfirm = readString(formData, "password_confirm")
  const first_name = readString(formData, "first_name")
  const last_name = readString(formData, "last_name")
  const phone = readOptionalString(formData, "phone")

  if (!first_name) {
    errors.first_name = "Prénom requis."
  }

  if (!last_name) {
    errors.last_name = "Nom requis."
  }

  if (!email) {
    errors.email = "Email requis."
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = "Email invalide."
  }

  if (!password) {
    errors.password = "Mot de passe requis."
  } else if (password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères.`
  }

  if (passwordConfirm && password !== passwordConfirm) {
    errors.password_confirm = "Les mots de passe ne correspondent pas."
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      errors,
      message: "Veuillez corriger les champs indiqués.",
    }
  }

  return {
    success: true,
    data: { email, password, first_name, last_name, phone },
  }
}
