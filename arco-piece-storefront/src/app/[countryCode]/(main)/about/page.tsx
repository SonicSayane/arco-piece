import { Heading, Text } from "@medusajs/ui"
import { Metadata } from "next"

import ArcButton from "@modules/common/components/arc-button"
import ArcCard from "@modules/common/components/arc-card"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Reveal from "@modules/common/components/reveal"

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Arco-Piece — votre partenaire pièces auto, moto, scooter et quad pour l'Afrique de l'Ouest et au-delà.",
}

const VALUES = [
  {
    eyebrow: "Notre mission",
    title: "Des pièces fiables, accessibles à tous",
    description:
      "Nous centralisons les pièces les plus demandées pour faciliter la vie des garages, des revendeurs et des particuliers, partout dans l'UEMOA et à l'international.",
    accent: "orange" as const,
    accentPosition: "tr" as const,
  },
  {
    eyebrow: "Nos valeurs",
    title: "Authenticité, transparence, proximité",
    description:
      "Référence OEM toujours visible, prix dans la devise locale, et un support qui répond en français en moins de 24 heures.",
    accent: "sky" as const,
    accentPosition: "bl" as const,
  },
  {
    eyebrow: "Notre engagement",
    title: "Construire un écosystème mobile-first",
    description:
      "Notre boutique est pensée pour le téléphone : sélecteur de véhicule rapide, paiement Mobile Money, livraison adaptée à chaque pays.",
    accent: "outline" as const,
    accentPosition: "br" as const,
  },
]

export default function AboutPage() {
  return (
    <div className="pb-20 small:pb-24">
      <Reveal as="section" className="content-container py-10 small:py-16">
        <div className="max-w-3xl">
          <Text className="font-body text-xs uppercase tracking-[0.18em] text-[var(--arc-accent)]">
            À propos
          </Text>
          <Heading
            level="h1"
            className="font-display mt-3 text-3xl small:text-5xl text-arc-ink leading-tight"
          >
            Arco-Piece, la pièce qu’il vous faut, sans détour.
          </Heading>
          <Text className="font-body mt-5 text-base small:text-lg text-arc-muted max-w-2xl">
            Nous sommes une équipe basée en Afrique de l’Ouest, passionnée par
            la mécanique et la qualité. Arco-Piece existe pour rendre l’accès
            aux bonnes références plus simple, plus rapide et plus
            transparent — du catalogue jusqu’à la livraison chez vous.
          </Text>
          <div className="mt-7 flex flex-wrap gap-3">
            <LocalizedClientLink href="/store">
              <ArcButton variant="primary">Voir le catalogue</ArcButton>
            </LocalizedClientLink>
            <LocalizedClientLink href="/how-to-order">
              <ArcButton variant="outline">Comment commander</ArcButton>
            </LocalizedClientLink>
          </div>
        </div>
      </Reveal>

      <section className="content-container">
        <div className="grid grid-cols-1 medium:grid-cols-3 gap-4">
          {VALUES.map((value, index) => (
            <Reveal
              key={value.title}
              delayClass={
                index === 1 ? "delay-150" : index === 2 ? "delay-300" : undefined
              }
            >
              <ArcCard
                eyebrow={value.eyebrow}
                title={value.title}
                description={value.description}
                accent={value.accent}
                accentPosition={value.accentPosition}
              />
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal as="section" className="content-container mt-12 small:mt-16">
        <div className="rounded-3xl border border-arc-divider bg-arc-surface p-6 small:p-10 shadow-[0_10px_25px_rgba(15,23,42,0.06)]">
          <Heading
            level="h2"
            className="font-display text-2xl small:text-3xl text-arc-ink"
          >
            Une question, un projet, un partenariat ?
          </Heading>
          <Text className="font-body mt-3 text-arc-muted max-w-2xl">
            Nous travaillons avec des garages, des concessionnaires et des
            revendeurs partout dans la sous-région. Écrivez-nous, nous
            répondons rapidement.
          </Text>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <a
              href="mailto:support@arco-piece.com"
              className="text-sm font-semibold text-[var(--arc-accent)] underline"
            >
              support@arco-piece.com
            </a>
            <LocalizedClientLink href="/faq">
              <ArcButton variant="ghost" size="sm">
                Voir la FAQ
              </ArcButton>
            </LocalizedClientLink>
          </div>
        </div>
      </Reveal>
    </div>
  )
}
