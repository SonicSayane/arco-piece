import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listAllProducts, listProducts } from "@lib/data/products"
import { getRegion, listRegions } from "@lib/data/regions"
import ProductJsonLd from "@modules/products/components/product-jsonld"
import ProductTemplate from "@modules/products/templates"
import { HttpTypes } from "@medusajs/types"
import { getBaseURL } from "@lib/util/env"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
  searchParams: Promise<{ v_id?: string }>
}

export async function generateStaticParams() {
  try {
    const countryCodes = await listRegions().then((regions) =>
      Array.from(
        new Set(
          (regions ?? [])
            .flatMap((region) =>
              (region.countries ?? []).map((country) => country.iso_2)
            )
            .filter((code): code is string => Boolean(code))
        )
      )
    )

    if (!countryCodes.length) {
      return []
    }

    const countryProducts = await Promise.allSettled(
      countryCodes.map(async (country) => {
        const { products } = await listAllProducts({
          countryCode: country,
          queryParams: { limit: 100, fields: "handle" },
        })

        return {
          country,
          products,
        }
      })
    )

    return countryProducts
      .flatMap((result) => {
        if (result.status !== "fulfilled") {
          return []
        }

        return result.value.products.map((product) => ({
          countryCode: result.value.country,
          handle: product.handle,
        }))
      })
      .filter((param) => param.handle)
  } catch (error) {
    console.error(
      `Failed to generate static paths for product pages: ${
        error instanceof Error ? error.message : "Unknown error"
      }.`
    )
    return []
  }
}

function getImagesForVariant(
  product: HttpTypes.StoreProduct,
  selectedVariantId?: string
) {
  if (!selectedVariantId || !product.variants) {
    return product.images
  }

  const variant = product.variants!.find((v) => v.id === selectedVariantId)
  if (!variant || !variant.images?.length) {
    return product.images
  }

  const imageIdsMap = new Map(variant.images.map((i) => [i.id, true]))
  return product.images!.filter((i) => imageIdsMap.has(i.id))
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const { handle } = params
  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  const product = await listProducts({
    countryCode: params.countryCode,
    queryParams: { handle },
  }).then(({ response }) => response.products[0])

  if (!product) {
    notFound()
  }

  const metadata = (product.metadata ?? {}) as Record<string, unknown>
  const oem = typeof metadata.oem_reference === "string" ? metadata.oem_reference : null

  const description = [
    product.description,
    oem ? `Reference OEM: ${oem}` : null,
  ]
    .filter((value): value is string => Boolean(value && value.trim()))
    .join(" - ")
    .slice(0, 300)

  const title = `${product.title} | Arco-Piece`
  const canonicalPath = `/${params.countryCode}/products/${handle}`
  const ogImages = product.thumbnail
    ? [{ url: product.thumbnail, alt: product.title }]
    : []
  const tagKeywords = (product.tags ?? [])
    .map((t) => t.value)
    .filter((value): value is string => Boolean(value))

  return {
    title,
    description: description || product.title,
    keywords: [
      product.title,
      ...(product.collection?.title ? [product.collection.title] : []),
      ...tagKeywords,
      ...(oem ? [oem] : []),
    ],
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: "website",
      siteName: "Arco-Piece",
      locale: params.countryCode === "fr" ? "fr_FR" : "fr",
      title,
      description: description || product.title,
      url: canonicalPath,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: description || product.title,
      images: ogImages.map((image) => image.url),
    },
  }
}

export default async function ProductPage(props: Props) {
  const params = await props.params
  const region = await getRegion(params.countryCode)
  const searchParams = await props.searchParams

  const selectedVariantId = searchParams.v_id

  if (!region) {
    notFound()
  }

  const pricedProduct = await listProducts({
    countryCode: params.countryCode,
    queryParams: { handle: params.handle },
  }).then(({ response }) => response.products[0])

  if (!pricedProduct) {
    notFound()
  }

  const images = getImagesForVariant(pricedProduct, selectedVariantId) ?? []
  const productUrl = `${getBaseURL()}/${params.countryCode}/products/${params.handle}`

  return (
    <>
      <ProductJsonLd product={pricedProduct} url={productUrl} />
      <ProductTemplate
        product={pricedProduct}
        region={region}
        countryCode={params.countryCode}
        images={images}
      />
    </>
  )
}
