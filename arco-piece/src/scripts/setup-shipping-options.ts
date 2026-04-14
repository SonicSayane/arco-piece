import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { createShippingOptionsWorkflow } from "@medusajs/medusa/core-flows";

type ShippingOptionLite = {
  name: string;
};

type ShippingProfileLite = {
  id: string;
  type?: string;
};

type ServiceZoneLite = {
  id: string;
};

type RegionLite = {
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

export default async function setupShippingOptions({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);

  const query = container.resolve(ContainerRegistrationKeys.QUERY) as {
    graph: (input: {
      entity: string;
      fields: string[];
      filters?: Record<string, unknown>;
    }) => Promise<{ data: Array<Record<string, unknown>> }>;
  };

  const [existingOptionsResult, shippingProfilesResult, serviceZonesResult, regionsResult] =
    await Promise.all([
      query.graph({ entity: "shipping_option", fields: ["id", "name"] }),
      query.graph({ entity: "shipping_profile", fields: ["id", "type"] }),
      query.graph({ entity: "service_zone", fields: ["id"] }),
      query.graph({ entity: "region", fields: ["id"] }),
    ]);

  const existingOptions = existingOptionsResult.data as ShippingOptionLite[];
  const shippingProfiles = shippingProfilesResult.data as ShippingProfileLite[];
  const serviceZones = serviceZonesResult.data as ServiceZoneLite[];
  const regions = regionsResult.data as RegionLite[];

  const shippingProfileId =
    shippingProfiles.find((profile) => profile.type === "default")?.id ??
    shippingProfiles[0]?.id;
  const serviceZoneId = serviceZones[0]?.id;
  const regionId = regions[0]?.id;

  if (!shippingProfileId || !serviceZoneId || !regionId) {
    throw new Error(
      "Missing shipping profile, service zone, or region. Ensure base seed data exists before running setup-shipping-options."
    );
  }

  const existingOptionNames = new Set(
    existingOptions.map((option) => option.name.trim().toLowerCase())
  );

  const missingOptions = SHIPPING_METHODS.filter((method) => {
    return !existingOptionNames.has(method.name.toLowerCase());
  });

  if (!missingOptions.length) {
    logger.info("All shipping methods already exist. Nothing to create.");
    return;
  }

  await createShippingOptionsWorkflow(container).run({
    input: missingOptions.map((method) => ({
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
          region_id: regionId,
          amount: method.amount,
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
    })),
  });

  logger.info(
    `Created ${missingOptions.length} shipping method(s): ${missingOptions
      .map((option) => option.name)
      .join(", ")}`
  );
}
