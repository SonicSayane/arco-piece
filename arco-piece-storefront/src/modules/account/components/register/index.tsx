"use client"

import { useActionState } from "react"
import Input from "@modules/common/components/input"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { signup } from "@lib/data/customer"
import Image from "next/image"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Register = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(signup, null)

  return (
    <div
      className="max-w-md w-full rounded-3xl border border-arc-divider bg-arc-surface px-6 py-8 small:px-8"
      data-testid="register-page"
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
        Creation de compte
      </h1>
      <p className="mt-2 text-center text-sm text-arc-muted mb-6">
        Creez votre profil Arco-Piece pour suivre vos commandes et sauvegarder
        vos informations.
      </p>

      <form className="w-full flex flex-col" action={formAction}>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="Prenom"
            name="first_name"
            required
            autoComplete="given-name"
            data-testid="first-name-input"
          />
          <Input
            label="Nom"
            name="last_name"
            required
            autoComplete="family-name"
            data-testid="last-name-input"
          />
          <Input
            label="Email"
            name="email"
            required
            type="email"
            autoComplete="email"
            data-testid="email-input"
          />
          <Input
            label="Telephone"
            name="phone"
            type="tel"
            autoComplete="tel"
            data-testid="phone-input"
          />
          <Input
            label="Password"
            name="password"
            required
            type="password"
            autoComplete="new-password"
            data-testid="password-input"
          />
        </div>
        <ErrorMessage error={message} data-testid="register-error" />
        <span className="text-center text-arc-muted text-small-regular mt-6">
          En creant un compte, vous acceptez la{" "}
          <LocalizedClientLink
            href="/content/privacy-policy"
            className="underline text-arc-ink"
          >
            Politique de confidentialite
          </LocalizedClientLink>{" "}
          et les{" "}
          <LocalizedClientLink
            href="/content/terms-of-use"
            className="underline text-arc-ink"
          >
            Conditions d&apos;utilisation
          </LocalizedClientLink>
          .
        </span>
        <SubmitButton className="w-full mt-6 h-11" data-testid="register-button">
          Creer mon compte
        </SubmitButton>
      </form>

      <span className="text-center text-arc-muted text-small-regular mt-6">
        Deja membre ?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="underline text-arc-ink"
        >
          Se connecter
        </button>
        .
      </span>
    </div>
  )
}

export default Register
