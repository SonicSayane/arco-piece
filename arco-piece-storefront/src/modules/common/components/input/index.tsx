import { Label } from "@medusajs/ui"
import React, { useImperativeHandle, useState } from "react"

import Eye from "@modules/common/icons/eye"
import EyeOff from "@modules/common/icons/eye-off"

type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "placeholder"
> & {
  label: string
  name: string
  topLabel?: string
  fieldError?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type,
      name,
      label,
      required,
      topLabel,
      fieldError,
      id,
      "aria-describedby": ariaDescribedByProp,
      className,
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [showPassword, setShowPassword] = useState(false)

    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement)

    const isPassword = type === "password"
    const inputType = isPassword ? (showPassword ? "text" : "password") : type

    const inputId = id ?? name
    const errorId = fieldError ? `${inputId}-error` : undefined
    const ariaDescribedBy =
      [ariaDescribedByProp, errorId].filter(Boolean).join(" ") || undefined

    return (
      <div className="flex flex-col w-full">
        {topLabel && (
          <Label className="mb-2 txt-compact-medium-plus">{topLabel}</Label>
        )}
        <div className="flex relative z-0 w-full txt-compact-medium">
          <input
            {...props}
            id={inputId}
            type={inputType}
            name={name}
            placeholder=" "
            required={required}
            aria-invalid={Boolean(fieldError)}
            aria-describedby={ariaDescribedBy}
            ref={inputRef}
            className={`pt-4 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active hover:bg-ui-bg-field-hover ${
              fieldError
                ? "border-rose-500 focus:border-rose-500"
                : "border-ui-border-base"
            }${className ? ` ${className}` : ""}`}
          />
          <label
            htmlFor={inputId}
            onClick={() => inputRef.current?.focus()}
            className="flex items-center justify-center mx-3 px-1 transition-all absolute duration-300 top-3 -z-1 origin-0 text-ui-fg-subtle"
          >
            {label}
            {required && (
              <span className="text-rose-500" aria-hidden="true">
                *
              </span>
            )}
          </label>
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={
                showPassword
                  ? "Masquer le mot de passe"
                  : "Afficher le mot de passe"
              }
              aria-pressed={showPassword}
              tabIndex={-1}
              className="text-ui-fg-subtle px-4 focus:outline-none transition-all duration-150 outline-none focus:text-ui-fg-base absolute right-0 top-3"
            >
              {showPassword ? <Eye /> : <EyeOff />}
            </button>
          )}
        </div>
        {fieldError && (
          <p
            id={errorId}
            role="alert"
            className="mt-1 text-small-regular text-rose-500"
          >
            {fieldError}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"

export default Input
