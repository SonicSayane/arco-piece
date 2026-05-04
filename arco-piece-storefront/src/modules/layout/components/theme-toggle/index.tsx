"use client"

import { setTheme } from "@lib/data/theme"
import { clx } from "@medusajs/ui"
import { useEffect, useState, useTransition } from "react"

type Props = {
  initialTheme: "light" | "dark"
  className?: string
}

const SunIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width={18}
    height={18}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
)

const MoonIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width={18}
    height={18}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

const ThemeToggle = ({ initialTheme, className }: Props) => {
  const [theme, setLocalTheme] = useState(initialTheme)
  const [, startTransition] = useTransition()

  // Sync the html.dark class with the local state.
  useEffect(() => {
    const root = document.documentElement
    if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }, [theme])

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark"
    setLocalTheme(next)
    startTransition(() => {
      setTheme(next)
    })
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={
        theme === "dark"
          ? "Passer en mode clair"
          : "Passer en mode sombre"
      }
      aria-pressed={theme === "dark"}
      className={clx(
        "inline-flex h-9 w-9 items-center justify-center rounded-full border border-arc-divider bg-arc-surface text-arc-ink transition-colors hover:bg-arc-surface-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--arc-accent)] focus-visible:ring-offset-2",
        className
      )}
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}

export default ThemeToggle
