"use client"

import React, { useEffect, useActionState } from "react"

import Input from "@modules/common/components/input"

import AccountInfo from "../account-info"
import { HttpTypes } from "@medusajs/types"
import { updateCustomer } from "@lib/data/customer"

type MyInformationProps = {
  customer: HttpTypes.StoreCustomer
}

type EmailState = {
  success: boolean
  error: string | null
}

const initialState: EmailState = {
  success: false,
  error: null,
}

const ProfileEmail: React.FC<MyInformationProps> = ({ customer }) => {
  const [successState, setSuccessState] = React.useState(false)

  const updateCustomerEmail = async (
    _currentState: EmailState,
    formData: FormData
  ): Promise<EmailState> => {
    const email = (formData.get("email") as string)?.trim().toLowerCase()

    if (!email) {
      return { success: false, error: "Email requis." }
    }

    if (email === customer.email) {
      return { success: true, error: null }
    }

    try {
      await updateCustomer({ email } as HttpTypes.StoreUpdateCustomer)
      return { success: true, error: null }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Impossible de mettre à jour l'email."
      return { success: false, error: message }
    }
  }

  const [state, formAction] = useActionState(updateCustomerEmail, initialState)

  const clearState = () => {
    setSuccessState(false)
  }

  useEffect(() => {
    setSuccessState(state.success)
  }, [state])

  return (
    <form action={formAction} className="w-full">
      <AccountInfo
        label="Email"
        currentInfo={`${customer.email}`}
        isSuccess={successState}
        isError={!!state.error}
        errorMessage={state.error ?? undefined}
        clearState={clearState}
        data-testid="account-email-editor"
      >
        <div className="grid grid-cols-1 gap-y-2">
          <Input
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue={customer.email}
            data-testid="email-input"
          />
        </div>
      </AccountInfo>
    </form>
  )
}

export default ProfileEmail
