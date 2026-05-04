"use client"

import React, { useEffect, useActionState, useRef } from "react"
import Input from "@modules/common/components/input"
import AccountInfo from "../account-info"
import { HttpTypes } from "@medusajs/types"
import {
  updateCustomerPassword,
  type AuthActionState,
} from "@lib/data/customer"

type MyInformationProps = {
  customer: HttpTypes.StoreCustomer
}

const ProfilePassword: React.FC<MyInformationProps> = ({ customer }) => {
  const [successState, setSuccessState] = React.useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const [state, formAction] = useActionState<AuthActionState, FormData>(
    updateCustomerPassword,
    null
  )

  const clearState = () => {
    setSuccessState(false)
  }

  // The action returns null on success (mirrors AuthActionState convention).
  useEffect(() => {
    if (state === null) {
      return
    }
    if (state.message === null && !state.errors) {
      setSuccessState(true)
      formRef.current?.reset()
    }
  }, [state])

  return (
    <form
      ref={formRef}
      action={formAction}
      onReset={clearState}
      className="w-full"
    >
      <input type="hidden" name="email" value={customer.email ?? ""} />
      <AccountInfo
        label="Mot de passe"
        currentInfo={
          <span>Le mot de passe n&apos;est pas affiché pour des raisons de sécurité</span>
        }
        isSuccess={successState}
        isError={Boolean(state?.message)}
        errorMessage={state?.message ?? undefined}
        clearState={clearState}
        data-testid="account-password-editor"
      >
        <div className="grid grid-cols-1 gap-4 small:grid-cols-2">
          <Input
            label="Mot de passe actuel"
            name="old_password"
            required
            type="password"
            autoComplete="current-password"
            fieldError={state?.errors?.old_password}
            data-testid="old-password-input"
          />
          <Input
            label="Nouveau mot de passe"
            type="password"
            name="new_password"
            required
            autoComplete="new-password"
            minLength={8}
            fieldError={state?.errors?.new_password}
            data-testid="new-password-input"
          />
          <Input
            label="Confirmer le mot de passe"
            type="password"
            name="confirm_password"
            required
            autoComplete="new-password"
            minLength={8}
            fieldError={state?.errors?.confirm_password}
            data-testid="confirm-password-input"
          />
        </div>
      </AccountInfo>
    </form>
  )
}

export default ProfilePassword
