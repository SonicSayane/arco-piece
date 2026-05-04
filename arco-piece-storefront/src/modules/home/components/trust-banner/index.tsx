import { Text } from "@medusajs/ui"
import * as React from "react"

type TrustItem = {
  title: string
  description: string
  icon: React.ReactNode
}

const ICON_CLASS = "h-5 w-5"
const STROKE_PROPS = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
}

const TRUST_ITEMS: TrustItem[] = [
  {
    title: "Paiement sécurisé",
    description: "Stripe — Visa, Mastercard, Mobile Money",
    icon: (
      <svg viewBox="0 0 24 24" className={ICON_CLASS} {...STROKE_PROPS}>
        <rect x="3" y="6" width="18" height="13" rx="2" />
        <path d="M3 10h18" />
        <path d="M7 15h3" />
      </svg>
    ),
  },
  {
    title: "Livraison UEMOA",
    description: "Couverture des 8 pays + international",
    icon: (
      <svg viewBox="0 0 24 24" className={ICON_CLASS} {...STROKE_PROPS}>
        <path d="M3 7h11v9H3z" />
        <path d="M14 10h4l3 3v3h-7" />
        <circle cx="7" cy="18" r="1.6" />
        <circle cx="17" cy="18" r="1.6" />
      </svg>
    ),
  },
  {
    title: "Support en français",
    description: "Notre équipe répond en moins de 24h",
    icon: (
      <svg viewBox="0 0 24 24" className={ICON_CLASS} {...STROKE_PROPS}>
        <path d="M21 11.5a8.5 8.5 0 1 1-3.6-6.93" />
        <path d="M21 4v5h-5" />
      </svg>
    ),
  },
  {
    title: "Pièces compatibles",
    description: "Recherche par marque, modèle, année",
    icon: (
      <svg viewBox="0 0 24 24" className={ICON_CLASS} {...STROKE_PROPS}>
        <circle cx="11" cy="11" r="6.5" />
        <path d="m20 20-3.5-3.5" />
      </svg>
    ),
  },
]

const TrustBanner = () => {
  return (
    <section
      aria-label="Garanties Arco-Piece"
      className="content-container -mt-2 pb-10 small:pb-12"
    >
      <ul className="grid grid-cols-2 medium:grid-cols-4 gap-3 small:gap-4">
        {TRUST_ITEMS.map((item) => (
          <li
            key={item.title}
            className="flex items-start gap-3 rounded-2xl border border-arc-divider bg-arc-surface px-4 py-3.5 transition-colors hover:bg-arc-surface-strong"
          >
            <span
              aria-hidden="true"
              className="mt-0.5 inline-flex h-9 w-9 flex-none items-center justify-center rounded-full bg-arc-surface-strong text-[var(--arc-accent)]"
            >
              {item.icon}
            </span>
            <div className="min-w-0">
              <Text className="font-body text-sm font-semibold text-arc-ink">
                {item.title}
              </Text>
              <Text className="font-body mt-0.5 text-xs text-arc-muted truncate">
                {item.description}
              </Text>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default TrustBanner
