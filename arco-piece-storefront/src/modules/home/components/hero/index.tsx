import { Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = () => {
  return (
    <section className="relative overflow-hidden px-4 small:px-6 pt-8 pb-10 small:pb-16">
      <div className="absolute -top-20 -left-20 h-60 w-60 rounded-full bg-[rgba(194,65,12,0.14)] blur-3xl" />
      <div className="absolute -bottom-24 right-0 h-64 w-64 rounded-full bg-[rgba(14,165,233,0.16)] blur-3xl" />

      <div className="content-container relative arc-panel rounded-3xl px-6 py-10 small:px-10 small:py-16 animate-arc-fade-up">
        <p className="font-body text-[11px] uppercase tracking-[0.25em] text-[var(--arc-accent)] animate-arc-fade-up">
          Arco-Piece Performance Store
        </p>

        <Heading
          level="h1"
          className="font-display mt-5 text-4xl small:text-5xl medium:text-6xl leading-tight text-arc-ink max-w-4xl animate-arc-fade-up animation-delay-150"
        >
          Les bonnes pieces, au bon moment, pour chaque vehicule.
        </Heading>

        <Text className="font-body mt-5 text-base small:text-lg text-arc-muted max-w-2xl animate-arc-fade-up animation-delay-300">
          Trouve rapidement tes references OEM pour voiture, moto, scooter et
          quad avec une experience fluide du catalogue jusqu au paiement.
        </Text>

        <div className="mt-8 flex flex-wrap gap-3 animate-arc-fade-up animation-delay-300">
          <LocalizedClientLink
            href="/store"
            className="inline-flex items-center rounded-full px-6 py-3 bg-[var(--arc-accent)] text-white text-sm font-semibold tracking-wide hover:brightness-110 transition"
          >
            Explorer le catalogue
          </LocalizedClientLink>
          <a
            href="#promos"
            className="inline-flex items-center rounded-full px-6 py-3 border border-arc-divider text-sm font-semibold tracking-wide text-arc-ink bg-arc-surface hover:bg-arc-surface-strong transition"
          >
            Voir les promos
          </a>
        </div>

        <ul className="mt-10 grid grid-cols-1 small:grid-cols-3 gap-3 text-sm animate-arc-fade-up animation-delay-300">
          <li className="rounded-2xl border border-arc-divider bg-arc-surface px-4 py-3">
            Disponibilite multi-regions
          </li>
          <li className="rounded-2xl border border-arc-divider bg-arc-surface px-4 py-3">
            Prix EUR, USD et XOF
          </li>
          <li className="rounded-2xl border border-arc-divider bg-arc-surface px-4 py-3">
            Recherche par compatibilite
          </li>
        </ul>
      </div>
    </section>
  )
}

export default Hero
