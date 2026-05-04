import { HttpTypes } from "@medusajs/types"

type Props = {
  product: HttpTypes.StoreProduct
  url: string
}

const buildOffers = (product: HttpTypes.StoreProduct) => {
  const variants = product.variants ?? []

  const offers = variants
    .map((variant) => {
      const price = (variant as unknown as {
        calculated_price?: {
          calculated_amount?: number
          currency_code?: string
        }
      }).calculated_price

      if (!price?.calculated_amount || !price.currency_code) {
        return null
      }

      return {
        "@type": "Offer",
        price: price.calculated_amount,
        priceCurrency: price.currency_code.toUpperCase(),
        availability:
          (variant as unknown as { inventory_quantity?: number })
            .inventory_quantity ?? 0 > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        sku: variant.sku ?? undefined,
      }
    })
    .filter(Boolean)

  return offers
}

const ProductJsonLd = ({ product, url }: Props) => {
  const offers = buildOffers(product)
  const metadata = (product.metadata ?? {}) as Record<string, unknown>
  const oem =
    typeof metadata.oem_reference === "string" ? metadata.oem_reference : null

  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description ?? undefined,
    image: product.images?.map((i) => i.url).filter(Boolean) ?? [],
    sku: product.variants?.[0]?.sku ?? undefined,
    mpn: oem ?? undefined,
    brand: product.collection?.title
      ? { "@type": "Brand", name: product.collection.title }
      : undefined,
    url,
    ...(offers.length > 0 ? { offers } : {}),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export default ProductJsonLd
