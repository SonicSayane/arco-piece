import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import TrustBanner from "@modules/home/components/trust-banner"
import VehicleFinder from "@modules/home/components/vehicle-finder"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { getVehicleOptions } from "@lib/data/vehicle-options"
import { getActiveVehicle } from "@lib/data/vehicles"
import { getDict } from "@lib/i18n"
import { Heading, Text } from "@medusajs/ui"
import ArcCard from "@modules/common/components/arc-card"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Reveal from "@modules/common/components/reveal"

const PROMO_CARDS = [
  {
    eyebrow: "Offres flash",
    title: "Promotions de la semaine",
    description:
      "Selection de pieces tres demandees avec prix competitifs et stock disponible.",
    href: "/store",
    cta: "Voir les offres",
    accent: "orange" as const,
    accentPosition: "tr" as const,
  },
  {
    eyebrow: "Livraison",
    title: "Service multi zones",
    description:
      "Couverture locale et internationale avec suivi simple depuis ton espace client.",
    href: "/store",
    cta: "Explorer le catalogue",
    accent: "sky" as const,
    accentPosition: "bl" as const,
    delay: "animation-delay-150",
  },
  {
    eyebrow: "Compatibilite",
    title: "Recherche guidee",
    description:
      "Identifie plus vite la bonne reference pour auto, moto, scooter et quad.",
    href: "/store",
    cta: "Commencer la recherche",
    accent: "outline" as const,
    accentPosition: "br" as const,
    delay: "animation-delay-300",
  },
]

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

  const [region, collectionsResp, dict, vehicleOptions, activeVehicle] =
    await Promise.all([
      getRegion(countryCode),
      listCollections({ fields: "id, handle, title" }),
      getDict(),
      getVehicleOptions({ countryCode }),
      getActiveVehicle(),
    ])

  const { collections } = collectionsResp

  if (!collections || !region) {
    return null
  }

  return (
    <>
      <Hero />

      <VehicleFinder options={vehicleOptions} defaults={activeVehicle} />

      <TrustBanner copy={dict.trust} />

      <Reveal as="section" className="content-container pb-10 small:pb-12">
        <div id="promos" className="grid grid-cols-1 medium:grid-cols-3 gap-4">
          {PROMO_CARDS.map((card, index) => (
            <Reveal
              key={card.title}
              delayClass={
                index === 1
                  ? "delay-150"
                  : index === 2
                    ? "delay-300"
                    : undefined
              }
            >
              <ArcCard
                eyebrow={card.eyebrow}
                title={card.title}
                description={card.description}
                accent={card.accent}
                accentPosition={card.accentPosition}
                footer={
                  <LocalizedClientLink
                    href={card.href}
                    className="inline-flex rounded-full border border-arc-divider bg-arc-surface-strong px-4 py-2 text-xs font-semibold text-arc-ink hover:bg-arc-surface transition"
                  >
                    {card.cta}
                  </LocalizedClientLink>
                }
              />
            </Reveal>
          ))}
        </div>
      </Reveal>

      <section className="pb-14 small:pb-20">
        <Reveal className="content-container mt-2 mb-6 small:mb-8">
          <Text className="font-body text-xs uppercase tracking-[0.18em] text-[var(--arc-accent)]">
            Catalogue
          </Text>
          <Heading
            level="h2"
            className="font-display mt-2 text-3xl small:text-4xl text-arc-ink"
          >
            Collections en vedette
          </Heading>
        </Reveal>

        <ul className="flex flex-col gap-y-2 small:gap-y-4">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </section>
    </>
  )
}
