import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Accueil",
  description:
    "Boutique e-commerce Arco-Piece pour vos pieces auto, moto, scooter et quad.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!collections || !region) {
    return null
  }

  return (
    <>
      <Hero />

      <section id="promos" className="content-container pb-10 small:pb-12">
        <div className="grid grid-cols-1 medium:grid-cols-3 gap-4">
          <article className="relative overflow-hidden rounded-3xl border border-arc-divider bg-arc-surface p-5 shadow-[0_10px_25px_rgba(15,23,42,0.08)] animate-arc-fade-up">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[rgba(194,65,12,0.18)] blur-2xl" />
            <Text className="font-body text-xs uppercase tracking-[0.14em] text-[var(--arc-accent)]">
              Offres flash
            </Text>
            <Heading level="h3" className="font-display mt-2 text-2xl text-arc-ink">
              Promotions de la semaine
            </Heading>
            <Text className="font-body mt-2 text-sm text-arc-muted">
              Selection de pieces tres demandees avec prix competitifs et stock
              disponible.
            </Text>
            <LocalizedClientLink
              href="/store"
              className="mt-4 inline-flex rounded-full border border-arc-divider bg-arc-surface-strong px-4 py-2 text-xs font-semibold text-arc-ink hover:bg-arc-surface transition"
            >
              Voir les offres
            </LocalizedClientLink>
          </article>

          <article className="relative overflow-hidden rounded-3xl border border-arc-divider bg-arc-surface p-5 shadow-[0_10px_25px_rgba(15,23,42,0.08)] animate-arc-fade-up animation-delay-150">
            <div className="absolute -left-6 -bottom-10 h-24 w-24 rounded-full bg-[rgba(14,165,233,0.16)] blur-2xl" />
            <Text className="font-body text-xs uppercase tracking-[0.14em] text-[var(--arc-accent)]">
              Livraison
            </Text>
            <Heading level="h3" className="font-display mt-2 text-2xl text-arc-ink">
              Service multi zones
            </Heading>
            <Text className="font-body mt-2 text-sm text-arc-muted">
              Couverture locale et internationale avec suivi simple depuis ton
              espace client.
            </Text>
            <LocalizedClientLink
              href="/store"
              className="mt-4 inline-flex rounded-full border border-arc-divider bg-arc-surface-strong px-4 py-2 text-xs font-semibold text-arc-ink hover:bg-arc-surface transition"
            >
              Explorer le catalogue
            </LocalizedClientLink>
          </article>

          <article className="relative overflow-hidden rounded-3xl border border-arc-divider bg-arc-surface p-5 shadow-[0_10px_25px_rgba(15,23,42,0.08)] animate-arc-fade-up animation-delay-300">
            <div className="absolute right-4 bottom-1 h-20 w-20 rounded-full border border-arc-divider" />
            <Text className="font-body text-xs uppercase tracking-[0.14em] text-[var(--arc-accent)]">
              Compatibilite
            </Text>
            <Heading level="h3" className="font-display mt-2 text-2xl text-arc-ink">
              Recherche guidee
            </Heading>
            <Text className="font-body mt-2 text-sm text-arc-muted">
              Identifie plus vite la bonne reference pour auto, moto, scooter
              et quad.
            </Text>
            <LocalizedClientLink
              href="/store"
              className="mt-4 inline-flex rounded-full border border-arc-divider bg-arc-surface-strong px-4 py-2 text-xs font-semibold text-arc-ink hover:bg-arc-surface transition"
            >
              Commencer la recherche
            </LocalizedClientLink>
          </article>
        </div>
      </section>

      <section className="pb-14 small:pb-20">
        <div className="content-container mt-2 mb-6 small:mb-8">
          <Text className="font-body text-xs uppercase tracking-[0.18em] text-[var(--arc-accent)]">
            Catalogue
          </Text>
          <Heading
            level="h2"
            className="font-display mt-2 text-3xl small:text-4xl text-arc-ink"
          >
            Collections en vedette
          </Heading>
        </div>

        <ul className="flex flex-col gap-y-2 small:gap-y-4">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </section>
    </>
  )
}
