import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { Heading, Text } from "@medusajs/ui"

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
