import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import {
  createShippingOptionsWorkflow,
  updateShippingOptionsWorkflow,
} from "@medusajs/medusa/core-flows";

type ShippingOptionLite = {
  id: string;
  name: string;
  service_zone_id?: string;
  prices?: Array<{
    currency_code?: string;
  }>;
};

type ShippingProfileLite = {
  id: string;
  type?: string;
};

type ServiceZoneLite = {
  id: string;
};

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

const XOF_PER_EUR_CENT = 6.56;

const toXofAmount = (eurAmount: number) =>
  Math.max(1, Math.round(eurAmount * XOF_PER_EUR_CENT));

export default async function setupShippingOptions({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);

  const query = container.resolve(ContainerRegistrationKeys.QUERY) as {
    graph: (input: {
      entity: string;
      fields: string[];
      filters?: Record<string, unknown>;
    }) => Promise<{ data: Array<Record<string, unknown>> }>;
  };

  const [existingOptionsResult, shippingProfilesResult, serviceZonesResult] =
    await Promise.all([
      query.graph({
        entity: "shipping_option",
        fields: [
          "id",
          "name",
          "service_zone_id",
          "prices.currency_code",
        ],
      }),
      query.graph({ entity: "shipping_profile", fields: ["id", "type"] }),
      query.graph({ entity: "service_zone", fields: ["id"] }),
    ]);

  const existingOptions = existingOptionsResult.data as ShippingOptionLite[];
  const shippingProfiles = shippingProfilesResult.data as ShippingProfileLite[];
  const serviceZones = serviceZonesResult.data as ServiceZoneLite[];

  const shippingProfileId =
    shippingProfiles.find((profile) => profile.type === "default")?.id ??
    shippingProfiles[0]?.id;
  const serviceZoneIds = serviceZones.map((serviceZone) => serviceZone.id);

  if (!shippingProfileId || !serviceZoneIds.length) {
    throw new Error(
      "Missing shipping profile or service zone. Ensure base seed data exists before running setup-shipping-options."
    );
  }

  const optionsToCreate: any[] = [];
  const optionsToUpdate: any[] = [];

  for (const serviceZoneId of serviceZoneIds) {
    for (const method of SHIPPING_METHODS) {
      const existingOption = existingOptions.find((option) => {
        return (
          option.service_zone_id === serviceZoneId &&
          option.name.trim().toLowerCase() === method.name.toLowerCase()
        );
      });

      if (!existingOption) {
        optionsToCreate.push({
          name: method.name,
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: serviceZoneId,
          shipping_profile_id: shippingProfileId,
          type: method.type,
          prices: [
            {
              currency_code: "usd",
              amount: method.amount,
            },
            {
              currency_code: "eur",
              amount: method.amount,
            },
            {
              currency_code: "xof",
              amount: toXofAmount(method.amount),
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

      const expectedCurrencies = ["eur", "usd", "xof"];
      const hasAllExpectedCurrencies = expectedCurrencies.every((currency) => {
        return existingCurrencies.includes(currency);
      });
      const hasDuplicateCurrencies =
        new Set(existingCurrencies).size !== existingCurrencies.length;

      if (!hasAllExpectedCurrencies || hasDuplicateCurrencies) {
        optionsToUpdate.push({
          id: existingOption.id,
          prices: [
            {
              currency_code: "usd",
              amount: method.amount,
            },
            {
              currency_code: "eur",
              amount: method.amount,
            },
            {
              currency_code: "xof",
              amount: toXofAmount(method.amount),
            },
          ],
        });
      }
    }
  }

  if (optionsToCreate.length) {
    await createShippingOptionsWorkflow(container).run({
      input: optionsToCreate,
    });

    logger.info(`Created ${optionsToCreate.length} shipping option(s).`);
  }

  if (optionsToUpdate.length) {
    await updateShippingOptionsWorkflow(container).run({
      input: optionsToUpdate,
    });

    logger.info(`Updated ${optionsToUpdate.length} shipping option(s) with XOF.`);
  }

  if (!optionsToCreate.length && !optionsToUpdate.length) {
    logger.info("All shipping methods already exist with XOF pricing.");
  }
}
