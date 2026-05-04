import { Heading } from "@medusajs/ui"
import { cookies as nextCookies } from "next/headers"

import CartTotals from "@modules/common/components/cart-totals"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OnboardingCta from "@modules/order/components/onboarding-cta"
import OrderDetails from "@modules/order/components/order-details"
import ShippingDetails from "@modules/order/components/shipping-details"
import PaymentDetails from "@modules/order/components/payment-details"
import { HttpTypes } from "@medusajs/types"

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
}

export default async function OrderCompletedTemplate({
  order,
}: OrderCompletedTemplateProps) {
  const cookies = await nextCookies()

  const isOnboarding = cookies.get("_medusa_onboarding")?.value === "true"

  return (
    <div className="py-8 small:py-12 min-h-[calc(100vh-64px)]">
      <div className="content-container flex flex-col items-center gap-y-6 max-w-4xl w-full">
        {isOnboarding && <OnboardingCta orderId={order.id} />}
        <div
          className="flex flex-col gap-6 max-w-4xl w-full rounded-3xl border border-arc-divider bg-arc-surface p-6 small:p-10 shadow-[0_10px_25px_rgba(15,23,42,0.06)]"
          data-testid="order-complete-container"
        >
          <Heading
            level="h1"
            className="flex flex-col gap-y-2 font-display text-arc-ink text-2xl small:text-3xl"
          >
            <span>Merci !</span>
            <span className="text-arc-muted text-base font-body font-normal">
              Votre commande a bien été enregistrée.
            </span>
          </Heading>
          <OrderDetails order={order} />
          <Heading
            level="h2"
            className="font-display text-2xl text-arc-ink"
          >
            Récapitulatif
          </Heading>
          <Items order={order} />
          <CartTotals totals={order} />
          <ShippingDetails order={order} />
          <PaymentDetails order={order} />
          <Help />
        </div>
      </div>
    </div>
  )
}
