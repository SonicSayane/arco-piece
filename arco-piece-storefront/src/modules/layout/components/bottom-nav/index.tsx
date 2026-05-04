"use client"

import { clx } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { usePathname } from "next/navigation"

type Item = {
  href: string
  label: string
  matches: (pathname: string) => boolean
  icon: React.ReactNode
}

const ICON_PROPS = {
  width: 22,
  height: 22,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
}

const ITEMS: Item[] = [
  {
    href: "/",
    label: "Accueil",
    matches: (path) => /^\/[a-z]{2}\/?$/.test(path),
    icon: (
      <svg viewBox="0 0 24 24" {...ICON_PROPS}>
        <path d="M3 11l9-7 9 7v9a2 2 0 0 1-2 2h-4v-6h-6v6H5a2 2 0 0 1-2-2v-9z" />
      </svg>
    ),
  },
  {
    href: "/store",
    label: "Catalogue",
    matches: (path) =>
      /^\/[a-z]{2}\/(store|categories|collections|products)/.test(path),
    icon: (
      <svg viewBox="0 0 24 24" {...ICON_PROPS}>
        <path d="M4 7h16l-1.4 11.2a2 2 0 0 1-2 1.8H7.4a2 2 0 0 1-2-1.8L4 7z" />
        <path d="M9 7V5a3 3 0 0 1 6 0v2" />
      </svg>
    ),
  },
  {
    href: "/cart",
    label: "Panier",
    matches: (path) => /^\/[a-z]{2}\/cart/.test(path),
    icon: (
      <svg viewBox="0 0 24 24" {...ICON_PROPS}>
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
      </svg>
    ),
  },
  {
    href: "/account",
    label: "Compte",
    matches: (path) => /^\/[a-z]{2}\/account/.test(path),
    icon: (
      <svg viewBox="0 0 24 24" {...ICON_PROPS}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </svg>
    ),
  },
]

const BottomNav = () => {
  const pathname = usePathname() ?? ""

  return (
    <nav
      aria-label="Navigation principale"
      className="small:hidden fixed bottom-0 inset-x-0 z-40 border-t border-arc-divider bg-arc-surface/95 backdrop-blur supports-[backdrop-filter]:bg-arc-surface/80"
    >
      <ul className="grid grid-cols-4 h-16">
        {ITEMS.map((item) => {
          const active = item.matches(pathname)
          return (
            <li key={item.href} className="flex">
              <LocalizedClientLink
                href={item.href}
                className={clx(
                  "flex flex-1 flex-col items-center justify-center gap-1 px-1 py-2 text-[10px] font-semibold tracking-wide uppercase transition-colors",
                  active
                    ? "text-[var(--arc-accent)]"
                    : "text-arc-muted hover:text-arc-ink"
                )}
                aria-current={active ? "page" : undefined}
              >
                <span aria-hidden="true">{item.icon}</span>
                <span>{item.label}</span>
              </LocalizedClientLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default BottomNav
