"use client"

import { clx } from "@medusajs/ui"
import { toggleWishlist } from "@lib/data/wishlist"
import { notify } from "@lib/util/notify"
import { useState, useTransition } from "react"

type Props = {
  handle: string
  initialInWishlist?: boolean
  size?: "sm" | "md"
  className?: string
}

const sizeClasses = {
  sm: "h-9 w-9",
  md: "h-11 w-11",
}

const iconSize = {
  sm: 16,
  md: 18,
}

const WishlistButton = ({
  handle,
  initialInWishlist = false,
  size = "md",
  className,
}: Props) => {
  const [active, setActive] = useState(initialInWishlist)
  const [, startTransition] = useTransition()

  const toggle = () => {
    const optimistic = !active
    setActive(optimistic)

    startTransition(async () => {
      try {
        const result = await toggleWishlist(handle)
        setActive(result.inWishlist)
        if (result.inWishlist) {
          notify.success("Ajouté à votre liste")
        } else {
          notify.info("Retiré de votre liste")
        }
      } catch {
        setActive(!optimistic)
        notify.error("Une erreur est survenue.")
      }
    })
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={active ? "Retirer de la liste" : "Ajouter à la liste"}
      aria-pressed={active}
      className={clx(
        "inline-flex items-center justify-center rounded-full border transition-colors",
        sizeClasses[size],
        active
          ? "border-[var(--arc-accent)] bg-[var(--arc-accent)] text-white hover:brightness-110"
          : "border-arc-divider bg-arc-surface text-arc-ink hover:bg-arc-surface-strong",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--arc-accent)] focus-visible:ring-offset-2",
        className
      )}
      data-testid="wishlist-button"
    >
      <svg
        viewBox="0 0 24 24"
        width={iconSize[size]}
        height={iconSize[size]}
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  )
}

export default WishlistButton
