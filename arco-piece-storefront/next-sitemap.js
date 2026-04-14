const excludedPaths = ["/checkout", "/account/*"]

const siteUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  process.env.NEXT_PUBLIC_VERCEL_URL ||
  "http://localhost:8000"

const backendUrl = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
const fallbackCountryCodes = ["dk", "fr", "de", "it", "es", "se", "gb"]

const noIndexPaths = new Set([
  "/icon.svg",
  "/opengraph-image.jpg",
  "/twitter-image.jpg",
])

const fetchStoreData = async (path) => {
  try {
    const response = await fetch(`${backendUrl}${path}`, {
      headers: {
        ...(publishableKey
          ? {
              "x-publishable-api-key": publishableKey,
            }
          : {}),
      },
    })

    if (!response.ok) {
      return null
    }

    return response.json()
  } catch (error) {
    return null
  }
}

const getCountryCodes = async () => {
  const data = await fetchStoreData("/store/regions")

  if (!data?.regions?.length) {
    return fallbackCountryCodes
  }

  return Array.from(
    new Set(
      data.regions
        .flatMap((region) => (region.countries || []).map((country) => country.iso_2))
        .filter(Boolean)
    )
  )
}

const getHandles = async (resourcePath, responseField) => {
  const data = await fetchStoreData(resourcePath)

  if (!data?.[responseField]?.length) {
    return []
  }

  return data[responseField]
    .map((item) => item.handle)
    .filter((handle) => typeof handle === "string" && handle.length > 0)
}

const buildAdditionalPaths = async (config) => {
  const [countries, productHandles, collectionHandles, categoryHandles] =
    await Promise.all([
      getCountryCodes(),
      getHandles("/store/products?limit=100&fields=handle", "products"),
      getHandles("/store/collections?limit=100&fields=handle", "collections"),
      getHandles("/store/product-categories?limit=100&fields=handle", "product_categories"),
    ])

  if (!countries.length) {
    return []
  }

  const paths = []

  for (const countryCode of countries) {
    paths.push({ loc: `/${countryCode}` })
    paths.push({ loc: `/${countryCode}/store` })

    for (const handle of productHandles) {
      paths.push({ loc: `/${countryCode}/products/${handle}` })
    }

    for (const handle of collectionHandles) {
      paths.push({ loc: `/${countryCode}/collections/${handle}` })
    }

    for (const handle of categoryHandles) {
      paths.push({ loc: `/${countryCode}/categories/${handle}` })
    }
  }

  return paths.map((path) => ({
    ...path,
    changefreq: "daily",
    priority: path.loc.includes("/products/") ? 0.9 : 0.8,
    lastmod: new Date().toISOString(),
  }))
}

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  exclude: [...excludedPaths, "/[sitemap]", ...Array.from(noIndexPaths)],
  transform: async (config, path) => {
    if (noIndexPaths.has(path)) {
      return null
    }

    return {
      loc: path,
      changefreq: "daily",
      priority: path.includes("/products/") ? 0.9 : 0.7,
      lastmod: new Date().toISOString(),
    }
  },
  additionalPaths: async (config) => buildAdditionalPaths(config),
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: "*",
        disallow: excludedPaths,
      },
    ],
  },
}
