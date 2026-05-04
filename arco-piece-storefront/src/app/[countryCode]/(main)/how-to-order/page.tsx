import { Heading, Text } from "@medusajs/ui"
import { Metadata } from "next"

import ArcButton from "@modules/common/components/arc-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Reveal from "@modules/common/components/reveal"

export const metadata: Metadata = {
  title: "Comment commander",
  description:
    "Commander sur Arco-Piece en 3 étapes simples : trouvez votre pièce, payez en sécurité, recevez chez vous.",
}

const STEPS = [
  {
    number: "01",
    title: "Trouvez la bonne pièce",
    description:
      "Utilisez le sélecteur de véhicule (marque, modèle, année) ou la barre de recherche. Le catalogue affiche directement les pièces compatibles avec leur référence OEM.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-7 w-7"
      >
        <circle cx="11" cy="11" r="6.5" />
        <path d="m20 20-3.5-3.5" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Ajoutez au panier et payez",
    description:
      "Mettez vos pièces au panier, choisissez l'adresse de livraison, puis réglez par carte (Visa, Mastercard) ou Mobile Money. Toutes les transactions sont sécurisées par Stripe.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-7 w-7"
      >
        <rect x="3" y="6" width="18" height="13" rx="2" />
        <path d="M3 10h18" />
        <path d="M7 15h3" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Recevez et installez",
    description:
      "Suivez votre commande dans votre espace client (timeline payée → préparée → expédiée → livrée). En cas de souci, notre équipe répond en moins de 24h.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-7 w-7"
      >
        <path d="M3 7h11v9H3z" />
        <path d="M14 10h4l3 3v3h-7" />
        <circle cx="7" cy="18" r="1.6" />
        <circle cx="17" cy="18" r="1.6" />
      </svg>
    ),
  },
]

export default function HowToOrderPage() {
  return (
    <div className="pb-20 small:pb-24">
      <section className="content-container py-10 small:py-16">
        <div className="max-w-3xl">
          <Text className="font-body text-xs uppercase tracking-[0.18em] text-[var(--arc-accent)]">
            Guide
          </Text>
          <Heading
            level="h1"
            className="font-display mt-3 text-3xl small:text-5xl text-arc-ink leading-tight"
          >
            Commander, c’est simple en 3 étapes.
          </Heading>
          <Text className="font-body mt-4 text-base small:text-lg text-arc-muted max-w-2xl">
            Notre objectif : vous faire gagner du temps. Voici comment passer
            une commande sur Arco-Piece, du catalogue à la livraison.
          </Text>
        </div>
      </section>

      <section className="content-container">
        <ol className="grid grid-cols-1 medium:grid-cols-3 gap-4 small:gap-6">
          {STEPS.map((step, index) => (
            <Reveal
              key={step.number}
              as="li"
              delayClass={
                index === 1 ? "delay-150" : index === 2 ? "delay-300" : undefined
              }
              className="relative flex flex-col gap-4 rounded-3xl border border-arc-divider bg-arc-surface p-6 small:p-8 shadow-[0_10px_25px_rgba(15,23,42,0.06)]"
            >
              <span className="absolute top-4 right-5 font-display text-5xl small:text-6xl text-[var(--arc-accent-soft)] leading-none select-none">
                {step.number}
              </span>
              <span
                aria-hidden="true"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-arc-surface-strong text-[var(--arc-accent)]"
              >
                {step.icon}
              </span>
              <Heading
                level="h2"
                className="font-display text-xl small:text-2xl text-arc-ink"
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

      <Reveal as="section" className="content-container mt-12 small:mt-16">
        <div className="rounded-3xl border border-arc-divider bg-arc-surface p-6 small:p-10 text-center">
          <Heading
            level="h2"
            className="font-display text-2xl small:text-3xl text-arc-ink"
          >
            Prêt à commander ?
          </Heading>
          <Text className="font-body mt-3 text-arc-muted max-w-xl mx-auto">
            Trouvez votre pièce, ajoutez-la au panier, recevez chez vous.
          </Text>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <LocalizedClientLink href="/store">
              <ArcButton variant="primary">Voir le catalogue</ArcButton>
            </LocalizedClientLink>
            <LocalizedClientLink href="/faq">
              <ArcButton variant="outline">Questions fréquentes</ArcButton>
            </LocalizedClientLink>
          </div>
        </div>
      </Reveal>
    </div>
  )
}
