import { clx } from "@medusajs/ui"
import * as React from "react"

type Variant = "primary" | "secondary" | "ghost" | "outline"
type Size = "sm" | "md" | "lg"

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-[var(--arc-accent)] text-white hover:bg-[#a3340a] active:bg-[#892a08] focus-visible:ring-2 focus-visible:ring-[var(--arc-accent)]",
  secondary:
    "bg-arc-surface-strong text-arc-ink border border-arc-divider hover:bg-arc-surface focus-visible:ring-2 focus-visible:ring-arc-divider",
  ghost:
    "bg-transparent text-arc-ink hover:bg-arc-surface-strong focus-visible:ring-2 focus-visible:ring-arc-divider",
  outline:
    "bg-transparent text-arc-ink border border-arc-divider hover:bg-arc-surface-strong focus-visible:ring-2 focus-visible:ring-arc-divider",
}

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
}

type ArcButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
  asPill?: boolean
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const ArcButton = React.forwardRef<HTMLButtonElement, ArcButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      asPill = true,
      isLoading = false,
      leftIcon,
      rightIcon,
      className,
      children,
      disabled,
      type = "button",
      ...rest
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        className={clx(
          "inline-flex items-center justify-center gap-2 font-semibold tracking-[0.02em] transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none",
          asPill ? "rounded-full" : "rounded-lg",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...rest}
      >
        {leftIcon && <span className="-ml-1 flex items-center">{leftIcon}</span>}
        {children}
        {rightIcon && (
          <span className="-mr-1 flex items-center">{rightIcon}</span>
        )}
      </button>
    )
  }
)

ArcButton.displayName = "ArcButton"

export default ArcButton
