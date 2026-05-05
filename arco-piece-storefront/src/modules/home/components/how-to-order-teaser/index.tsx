import { Heading, Text } from "@medusajs/ui"

import ArcButton from "@modules/common/components/arc-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Reveal from "@modules/common/components/reveal"

const ICON_PROPS = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "h-6 w-6",
}

type Tone = "trust" | "accent" | "success"

const TONE_CLASSES: Record<Tone, string> = {
  trust: "bg-arc-trust-soft text-arc-trust",
  accent: "bg-[var(--arc-accent-soft)] text-[var(--arc-accent)]",
  success: "bg-arc-success-soft text-arc-success",
}

const STEPS: Array<{
  number: string
  title: string
  description: string
  tone: Tone
  icon: React.ReactNode
}> = [
  {
    number: "01",
    title: "Trouvez votre pièce",
    description:
      "Sélecteur de véhicule ou recherche par référence OEM en haut de page.",
    tone: "trust",
    icon: (
      <svg viewBox="0 0 24 24" {...ICON_PROPS}>
        <circle cx="11" cy="11" r="6.5" />
        <path d="m20 20-3.5-3.5" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Payez en sécurité",
    description:
      "Visa, Mastercard ou Mobile Money. Transactions chiffrées via Stripe.",
    tone: "accent",
    icon: (
      <svg viewBox="0 0 24 24" {...ICON_PROPS}>
        <rect x="3" y="6" width="18" height="13" rx="2" />
        <path d="M3 10h18" />
        <path d="M7 15h3" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Recevez chez vous",
    description:
      "Suivi en temps réel dans votre compte, livraison sur l’ensemble de l’UEMOA.",
    tone: "success",
    icon: (
      <svg viewBox="0 0 24 24" {...ICON_PROPS}>
        <path d="M3 7h11v9H3z" />
        <path d="M14 10h4l3 3v3h-7" />
        <circle cx="7" cy="18" r="1.6" />
        <circle cx="17" cy="18" r="1.6" />
      </svg>
    ),
  },
]

const HowToOrderTeaser = () => {
  return (
    <section
      aria-label="Comment commander"
      className="content-container pb-12 small:pb-16"
    >
      <div className="mb-6 small:mb-8">
        <Text className="font-body text-xs uppercase tracking-[0.18em] text-[var(--arc-accent)]">
          Comment ça marche
        </Text>
        <div className="flex flex-col small:flex-row small:items-end small:justify-between gap-3 mt-2">
          <Heading
            level="h2"
            className="font-display text-3xl small:text-4xl text-arc-ink max-w-2xl"
          >
            Commander, c’est simple en 3 étapes.
          </Heading>
          <LocalizedClientLink href="/how-to-order" className="small:flex-none">
            <ArcButton variant="ghost" size="sm">
              Guide complet →
            </ArcButton>
          </LocalizedClientLink>
        </div>
      </div>

      <ol className="grid grid-cols-1 medium:grid-cols-3 gap-4 small:gap-6">
        {STEPS.map((step, index) => (
          <Reveal
            key={step.number}
            as="li"
            delayClass={
              index === 1 ? "delay-150" : index === 2 ? "delay-300" : undefined
            }
            className="relative flex flex-col gap-3 rounded-3xl border border-arc-divider bg-arc-surface p-5 small:p-6 shadow-[0_10px_25px_rgba(15,23,42,0.06)]"
          >
            <span className="absolute top-3 right-4 font-display text-4xl small:text-5xl text-arc-divider leading-none select-none pointer-events-none">
              {step.number}
            </span>
            <span
              aria-hidden="true"
              className={
                "inline-flex h-10 w-10 items-center justify-center rounded-full " +
                TONE_CLASSES[step.tone]
              }
            >
              {step.icon}
            </span>
            <Heading
              level="h3"
              className="font-display text-lg small:text-xl text-arc-ink"
            >
              {step.title}
            </Heading>
            <Text className="font-body text-sm text-arc-muted leading-relaxed">
              {step.description}
            </Text>
          </Reveal>
        ))}
      </ol>
    </section>
  )
}

export default HowToOrderTeaser
