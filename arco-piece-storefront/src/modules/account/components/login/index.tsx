"use client"

import { login, type AuthActionState } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useActionState } from "react"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Login = ({ setCurrentView }: Props) => {
  const [state, formAction] = useActionState<AuthActionState, FormData>(
    login,
    null
  )
  const params = useParams<{ countryCode?: string }>()
  const countryCode =
    typeof params?.countryCode === "string" ? params.countryCode : ""

  return (
    <div
      className="max-w-md w-full rounded-3xl border border-arc-divider bg-arc-surface px-6 py-8 small:px-8"
      data-testid="login-page"
    >
      <div className="mb-6 flex items-center justify-center gap-2">
        <Image
          src="/arco-piece-svg.svg"
          alt="Arco-Piece"
          width={34}
          height={34}
          className="h-8 w-8 object-contain"
        />
        <span className="font-display text-xl tracking-[-0.02em] text-arc-ink">
          Arco-Piece
        </span>
      </div>

      <h1 className="text-center font-display text-2xl text-arc-ink">
        Bienvenue sur Arco-Piece
      </h1>
      <p className="mt-2 text-center text-sm text-arc-muted mb-8">
        Connectez-vous pour suivre vos commandes et accélérer vos achats.
      </p>

      <form className="w-full" action={formAction} noValidate>
        {countryCode && (
          <input type="hidden" name="country_code" value={countryCode} />
        )}
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="Email"
            name="email"
            type="email"
            title="Saisissez une adresse email valide."
            autoComplete="email"
            required
            fieldError={state?.errors?.email}
            data-testid="email-input"
          />
          <Input
            label="Mot de passe"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            fieldError={state?.errors?.password}
            data-testid="password-input"
          />
        </div>
        <ErrorMessage
          error={state?.message ?? null}
          data-testid="login-error-message"
        />
        <SubmitButton data-testid="sign-in-button" className="w-full mt-6 h-11">
          Se connecter
        </SubmitButton>
      </form>

      <span className="text-center text-arc-muted text-small-regular mt-6 block">
        Pas encore de compte ?{" "}
        <button
          type="button"
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
          className="underline text-arc-ink"
          data-testid="register-button"
        >
          Créer un compte
        </button>
        .
      </span>
    </div>
  )
}

export default Login
