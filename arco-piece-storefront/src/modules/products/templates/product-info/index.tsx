import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const metadata = (product.metadata ?? {}) as Record<string, unknown>

  const readMetadataValue = (keys: string[]): string | null => {
    for (const key of keys) {
      const value = metadata[key]

      if (typeof value === "string" && value.trim()) {
        return value
      }

      if (typeof value === "number") {
        return String(value)
      }
    }

    return null
  }

  const referenceOem = readMetadataValue(["oem_reference", "oem", "reference_oem"])
  const vehicleBrand = readMetadataValue(["vehicle_brand", "brand", "marque_vehicule"])
  const vehicleModel = readMetadataValue(["model", "vehicle_model", "modele"])
  const vehicleYear = readMetadataValue(["year", "vehicle_year", "annee"])
  const condition = readMetadataValue(["condition", "etat"])
  const warranty = readMetadataValue(["warranty", "garantie"])

  const vehicleCompatibility = [vehicleBrand, vehicleModel, vehicleYear]
    .filter((value): value is string => Boolean(value))
    .join(" - ")

  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-4 lg:max-w-[500px] mx-auto">
        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="text-medium text-ui-fg-muted hover:text-ui-fg-subtle"
          >
            {product.collection.title}
          </LocalizedClientLink>
        )}
        <Heading
          level="h2"
          className="text-3xl leading-10 text-ui-fg-base"
          data-testid="product-title"
        >
          {product.title}
        </Heading>

        <Text
          className="text-medium text-ui-fg-subtle whitespace-pre-line"
          data-testid="product-description"
        >
          {product.description}
        </Text>

        <div className="flex flex-col gap-y-2 border border-ui-border-base rounded-rounded p-4">
          <Text className="text-small text-ui-fg-muted">Reference OEM</Text>
          <Text className="text-small text-ui-fg-base" data-testid="product-oem-reference">
            {referenceOem ?? "Non renseignee"}
          </Text>

          <Text className="text-small text-ui-fg-muted mt-2">Compatibilite vehicule</Text>
          <Text
            className="text-small text-ui-fg-base"
            data-testid="product-vehicle-compatibility"
          >
            {vehicleCompatibility || "Non renseignee"}
          </Text>

          <Text className="text-small text-ui-fg-muted mt-2">Etat</Text>
          <Text className="text-small text-ui-fg-base" data-testid="product-condition">
            {condition ?? "Neuf"}
          </Text>

          <Text className="text-small text-ui-fg-muted mt-2">Garantie</Text>
          <Text className="text-small text-ui-fg-base" data-testid="product-warranty">
            {warranty ?? "Non renseignee"}
          </Text>
        </div>
      </div>
    </div>
  )
}

export default ProductInfo
