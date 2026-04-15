import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import {
  createRegionsWorkflow,
  createShippingOptionsWorkflow,
  createTaxRegionsWorkflow,
  updateProductVariantsWorkflow,
  updateRegionsWorkflow,
  updateServiceZonesWorkflow,
  updateShippingOptionsWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows";

type StoreCurrencyLite = {
  currency_code: string;
  is_default?: boolean;
};

type StoreLite = {
  id: string;
  supported_currencies?: StoreCurrencyLite[];
};

type RegionLite = {
  id: string;
  name: string;
  currency_code: string;
  countries?: { iso_2?: string }[];
};

type TaxRegionLite = {
  country_code: string;
};

type GeoZoneLite = {
  id: string;
  type: string;
  country_code?: string;
};

type ServiceZoneLite = {
  id: string;
  name?: string;
  service_zone_id?: string;
  fulfillment_set_id?: string;
  geo_zones?: GeoZoneLite[];
};

type ShippingProfileLite = {
  id: string;
  type?: string;
};

type ShippingOptionPriceLite = {
  id?: string;
  currency_code?: string;
  amount?: number;
};

type ShippingOptionLite = {
  id: string;
  name: string;
  service_zone_id?: string;
  shipping_profile_id?: string;
  prices?: ShippingOptionPriceLite[];
};

type ProductVariantLite = {
  id: string;
  prices?: {
    id?: string;
    currency_code?: string;
    amount?: number;
  }[];
};

const EUROPE_COUNTRIES = ["gb", "de", "dk", "se", "fr", "es", "it"];
const WEST_AFRICA_COUNTRIES = ["ne", "bj", "bf", "ci", "gw", "ml", "sn", "tg"];
const REQUIRED_CURRENCIES = ["eur", "usd", "xof"];

const SHIPPING_METHODS = [
  {
    name: "Standard Shipping",
    type: {
      label: "Standard",
      description: "Ship in 2-3 days.",
      code: "standard",
    },
    amount: 10,
  },
  {
    name: "Express Shipping",
    type: {
      label: "Express",
      description: "Ship in 24 hours.",
      code: "express",
    },
    amount: 10,
  },
  {
    name: "Relay Point Pickup",
    type: {
      label: "Point Relais",
      description: "Pickup from a nearby relay point.",
      code: "point-relais",
    },
    amount: 5,
  },
] as const;

const XOF_PER_EUR = 655.957;
const DEFAULT_USD_PER_EUR = 1.1793;

const parsePositiveNumber = (value: string | undefined, fallback: number) => {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
};

const USD_PER_EUR = parsePositiveNumber(
  process.env.MARKET_USD_PER_EUR,
  DEFAULT_USD_PER_EUR
);

const toXofAmount = (eurAmount: number) =>
  Math.max(1, Math.round(eurAmount * XOF_PER_EUR));

const toEurAmountFromXof = (xofAmount: number) =>
  Math.max(1, Math.round(xofAmount / XOF_PER_EUR));

const toUsdAmountFromEur = (eurAmount: number) =>
  Math.max(1, Math.round(eurAmount * USD_PER_EUR));

const toEurAmountFromUsd = (usdAmount: number) =>
  Math.max(1, Math.round(usdAmount / USD_PER_EUR));

const chunk = <T>(items: T[], size: number) => {
  const result: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    result.push(items.slice(index, index + size));
  }

  return result;
};

export default async function setupWestAfricaMarket({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY) as {
    graph: <T = Record<string, unknown>>(input: {
      entity: string;
      fields: string[];
      filters?: Record<string, unknown>;
    }) => Promise<{ data: T[] }>;
  };

  const storeModuleService = container.resolve(Modules.STORE) as {
    listStores: () => Promise<Array<{ id: string }>>;
  };

  logger.info("Setting up West Africa market...");

  const [store] = await storeModuleService.listStores();

  if (!store?.id) {
    throw new Error("No store found. Seed the store first.");
  }

  const { data: storesData } = await query.graph<StoreLite>({
    entity: "store",
    fields: ["id", "supported_currencies.currency_code", "supported_currencies.is_default"],
  });

  const storeData = storesData.find((row) => row.id === store.id);
  const existingCurrencies = storeData?.supported_currencies ?? [];

  const currencyMap = new Map<string, StoreCurrencyLite>();

  for (const currency of existingCurrencies) {
    if (!currency.currency_code) {
      continue;
    }

    currencyMap.set(currency.currency_code.toLowerCase(), {
      currency_code: currency.currency_code.toLowerCase(),
      is_default: Boolean(currency.is_default),
    });
  }

  for (const currencyCode of REQUIRED_CURRENCIES) {
    if (!currencyMap.has(currencyCode)) {
      currencyMap.set(currencyCode, {
        currency_code: currencyCode,
        is_default: false,
      });
    }
  }

  const hasDefault = Array.from(currencyMap.values()).some(
    (currency) => currency.is_default
  );

  if (!hasDefault && currencyMap.has("eur")) {
    currencyMap.set("eur", {
      currency_code: "eur",
      is_default: true,
    });
  }

  const mergedCurrencies = Array.from(currencyMap.values());

  const normalizeCurrencyList = (currencies: StoreCurrencyLite[]) =>
    currencies
      .map((currency) => ({
        currency_code: currency.currency_code.toLowerCase(),
        is_default: Boolean(currency.is_default),
      }))
      .sort((left, right) => left.currency_code.localeCompare(right.currency_code));

  const currenciesChanged =
    JSON.stringify(normalizeCurrencyList(existingCurrencies)) !==
    JSON.stringify(normalizeCurrencyList(mergedCurrencies));

  if (currenciesChanged) {
    await updateStoresWorkflow(container).run({
      input: {
        selector: { id: store.id },
        update: {
          supported_currencies: mergedCurrencies,
        },
      },
    });

    logger.info("Updated store currencies to include XOF.");
  } else {
    logger.info("Store currencies already include XOF.");
  }

  const { data: regionsData } = await query.graph<RegionLite>({
    entity: "region",
    fields: ["id", "name", "currency_code", "countries.iso_2"],
  });

  let westAfricaRegion = regionsData.find((region) => {
    const countryCodes = new Set(
      (region.countries ?? [])
        .map((country) => country.iso_2?.toLowerCase())
        .filter((code): code is string => Boolean(code))
    );

    return (
      countryCodes.has("ne") ||
      region.currency_code?.toLowerCase() === "xof" ||
      region.name?.toLowerCase().includes("west")
    );
  });

  if (!westAfricaRegion) {
    const { result } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "West Africa",
            currency_code: "xof",
            countries: WEST_AFRICA_COUNTRIES,
            payment_providers: ["pp_system_default", "pp_stripe_stripe"],
          },
        ],
      },
    });

    westAfricaRegion = result[0] as RegionLite;
    logger.info("Created West Africa region.");
  } else {
    const existingCountryCodes = new Set(
      (westAfricaRegion.countries ?? [])
        .map((country) => country.iso_2?.toLowerCase())
        .filter((code): code is string => Boolean(code))
    );

    const mergedCountryCodes = Array.from(
      new Set([...existingCountryCodes, ...WEST_AFRICA_COUNTRIES])
    );

    const regionNeedsUpdate =
      westAfricaRegion.currency_code?.toLowerCase() !== "xof" ||
      westAfricaRegion.name !== "West Africa" ||
      mergedCountryCodes.length !== existingCountryCodes.size;

    if (regionNeedsUpdate) {
      const { result } = await updateRegionsWorkflow(container).run({
        input: {
          selector: { id: westAfricaRegion.id },
          update: {
            name: "West Africa",
            currency_code: "xof",
            countries: mergedCountryCodes,
          },
        },
      });

      westAfricaRegion = result[0] as RegionLite;
      logger.info("Updated West Africa region with XOF and UEMOA countries.");
    } else {
      logger.info("West Africa region already configured.");
    }
  }

  if (!westAfricaRegion?.id) {
    throw new Error("Could not resolve West Africa region.");
  }

  const { data: taxRegionsData } = await query.graph<TaxRegionLite>({
    entity: "tax_region",
    fields: ["country_code"],
  });

  const taxCountries = new Set(
    taxRegionsData
      .map((taxRegion) => taxRegion.country_code?.toLowerCase())
      .filter((code): code is string => Boolean(code))
  );

  const missingTaxCountries = WEST_AFRICA_COUNTRIES.filter(
    (countryCode) => !taxCountries.has(countryCode)
  );

  if (missingTaxCountries.length) {
    await createTaxRegionsWorkflow(container).run({
      input: missingTaxCountries.map((country_code) => ({
        country_code,
        provider_id: "tp_system",
      })),
    });

    logger.info(`Created tax regions for: ${missingTaxCountries.join(", ")}`);
  } else {
    logger.info("Tax regions already cover West Africa countries.");
  }

  const { data: serviceZonesData } = await query.graph<ServiceZoneLite>({
    entity: "service_zone",
    fields: [
      "id",
      "name",
      "fulfillment_set_id",
      "geo_zones.id",
      "geo_zones.type",
      "geo_zones.country_code",
    ],
  });

  const primaryServiceZone =
    serviceZonesData.find((zone) =>
      zone.geo_zones?.some((geoZone) =>
        EUROPE_COUNTRIES.includes((geoZone.country_code ?? "").toLowerCase())
      )
    ) ?? serviceZonesData[0];

  if (!primaryServiceZone?.id) {
    throw new Error(
      "No service zone found. Seed shipping data before running setup-west-africa-market."
    );
  }

  const serviceZoneCountries = new Set(
    (primaryServiceZone.geo_zones ?? [])
      .map((geoZone) => geoZone.country_code?.toLowerCase())
      .filter((countryCode): countryCode is string => Boolean(countryCode))
  );

  const missingGeoZones = WEST_AFRICA_COUNTRIES.filter(
    (countryCode) => !serviceZoneCountries.has(countryCode)
  );

  if (missingGeoZones.length) {
    await updateServiceZonesWorkflow(container).run({
      input: {
        selector: {
          id: primaryServiceZone.id,
        },
        update: {
          geo_zones: missingGeoZones.map((country_code) => ({
            type: "country",
            country_code,
          })),
        },
      },
    });

    logger.info(
      `Added West Africa countries to service zone ${primaryServiceZone.id}: ${missingGeoZones.join(
        ", "
      )}`
    );
  } else {
    logger.info("Service zone already covers West Africa countries.");
  }

  const { data: shippingProfilesData } = await query.graph<ShippingProfileLite>({
    entity: "shipping_profile",
    fields: ["id", "type"],
  });

  const shippingProfileId =
    shippingProfilesData.find((profile) => profile.type === "default")?.id ??
    shippingProfilesData[0]?.id;

  if (!shippingProfileId) {
    throw new Error("No shipping profile found.");
  }

  const { data: shippingOptionsData } = await query.graph<ShippingOptionLite>({
    entity: "shipping_option",
    fields: [
      "id",
      "name",
      "service_zone_id",
      "shipping_profile_id",
      "prices.id",
      "prices.currency_code",
      "prices.amount",
    ],
  });

  const optionsInPrimaryServiceZone = shippingOptionsData.filter(
    (option) => option.service_zone_id === primaryServiceZone.id
  );

  const shippingOptionsToCreate: any[] = [];
  const shippingOptionsToUpdate: any[] = [];

  for (const method of SHIPPING_METHODS) {
    const expectedEurAmount = method.amount;
    const expectedUsdAmount = toUsdAmountFromEur(expectedEurAmount);
    const expectedXofAmount = toXofAmount(expectedEurAmount);

    const existingOption = optionsInPrimaryServiceZone.find(
      (option) => option.name.trim().toLowerCase() === method.name.toLowerCase()
    );

    if (!existingOption) {
      shippingOptionsToCreate.push({
        name: method.name,
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: primaryServiceZone.id,
        shipping_profile_id: shippingProfileId,
        type: method.type,
        prices: [
          {
            currency_code: "usd",
            amount: expectedUsdAmount,
          },
          {
            currency_code: "eur",
            amount: expectedEurAmount,
          },
          {
            currency_code: "xof",
            amount: expectedXofAmount,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      });

      continue;
    }

    const existingCurrencies = (existingOption.prices ?? [])
      .map((price) => price.currency_code?.toLowerCase())
      .filter((currency): currency is string => Boolean(currency));

    const priceByCurrency = new Map<string, number>();

    for (const price of existingOption.prices ?? []) {
      const currencyCode = price.currency_code?.toLowerCase();
      if (!currencyCode || typeof price.amount !== "number") {
        continue;
      }

      priceByCurrency.set(currencyCode, price.amount);
    }

    const expectedCurrencies = ["eur", "usd", "xof"];
    const hasAllExpectedCurrencies = expectedCurrencies.every((currency) => {
      return existingCurrencies.includes(currency);
    });
    const hasDuplicateCurrencies =
      new Set(existingCurrencies).size !== existingCurrencies.length;

    const hasUnexpectedAmounts =
      (typeof priceByCurrency.get("eur") === "number" &&
        priceByCurrency.get("eur") !== expectedEurAmount) ||
      (typeof priceByCurrency.get("usd") === "number" &&
        priceByCurrency.get("usd") !== expectedUsdAmount) ||
      (typeof priceByCurrency.get("xof") === "number" &&
        priceByCurrency.get("xof") !== expectedXofAmount);

    if (!hasAllExpectedCurrencies || hasDuplicateCurrencies || hasUnexpectedAmounts) {
      shippingOptionsToUpdate.push({
        id: existingOption.id,
        prices: [
          {
            currency_code: "usd",
            amount: expectedUsdAmount,
          },
          {
            currency_code: "eur",
            amount: expectedEurAmount,
          },
          {
            currency_code: "xof",
            amount: expectedXofAmount,
          },
        ],
      });
    }
  }

  if (shippingOptionsToCreate.length) {
    await createShippingOptionsWorkflow(container).run({
      input: shippingOptionsToCreate,
    });

    logger.info(`Created ${shippingOptionsToCreate.length} shipping option(s).`);
  } else {
    logger.info("No shipping options needed to be created.");
  }

  if (shippingOptionsToUpdate.length) {
    await updateShippingOptionsWorkflow(container).run({
      input: shippingOptionsToUpdate,
    });

    logger.info(
      `Updated ${shippingOptionsToUpdate.length} shipping option(s) with EUR/USD/XOF prices.`
    );
  } else {
    logger.info("Shipping options already include EUR/USD/XOF pricing.");
  }

  const { data: productVariantsData } = await query.graph<ProductVariantLite>({
    entity: "product_variant",
    fields: ["id", "prices.id", "prices.currency_code", "prices.amount"],
  });

  const variantUpdates = productVariantsData
    .map((variant) => {
      const currencies = (variant.prices ?? [])
        .map((price) => price.currency_code?.toLowerCase())
        .filter((currency): currency is string => Boolean(currency));

      const hasAllExpectedCurrencies = ["eur", "usd", "xof"].every((currency) => {
        return currencies.includes(currency);
      });

      const hasDuplicateCurrencies =
        new Set(currencies).size !== currencies.length;

      const eurPriceAmount = (variant.prices ?? []).find(
        (price) => price.currency_code?.toLowerCase() === "eur"
      )?.amount;

      const usdPriceAmount = (variant.prices ?? []).find(
        (price) => price.currency_code?.toLowerCase() === "usd"
      )?.amount;

      const xofPriceAmount = (variant.prices ?? []).find(
        (price) => price.currency_code?.toLowerCase() === "xof"
      )?.amount;

      const resolvedEurAmount =
        typeof eurPriceAmount === "number"
          ? eurPriceAmount
          : typeof usdPriceAmount === "number"
            ? toEurAmountFromUsd(usdPriceAmount)
            : typeof xofPriceAmount === "number"
              ? toEurAmountFromXof(xofPriceAmount)
              : 10;

      const expectedUsdAmount = toUsdAmountFromEur(resolvedEurAmount);
      const expectedXofAmount = toXofAmount(resolvedEurAmount);

      const hasUnexpectedAmounts =
        (typeof usdPriceAmount === "number" && usdPriceAmount !== expectedUsdAmount) ||
        (typeof xofPriceAmount === "number" && xofPriceAmount !== expectedXofAmount);

      const shouldUpdate =
        !hasAllExpectedCurrencies || hasDuplicateCurrencies || hasUnexpectedAmounts;

      if (!shouldUpdate) {
        return null;
      }

      return {
        id: variant.id,
        prices: [
          {
            currency_code: "eur",
            amount: resolvedEurAmount,
          },
          {
            currency_code: "usd",
            amount: expectedUsdAmount,
          },
          {
            currency_code: "xof",
            amount: expectedXofAmount,
          },
        ],
      };
    })
    .filter(
      (
        variant
      ): variant is {
        id: string;
        prices: Array<{ currency_code: string; amount: number }>;
      } => Boolean(variant)
    );

  if (variantUpdates.length) {
    for (const updates of chunk(variantUpdates, 50)) {
      await updateProductVariantsWorkflow(container).run({
        input: {
          product_variants: updates,
        },
      });
    }

    logger.info(
      `Updated ${variantUpdates.length} variant(s) to keep EUR/USD/XOF prices.`
    );
  } else {
    logger.info("All variants already include EUR/USD/XOF pricing.");
  }

  logger.info("West Africa market setup completed.");
}
