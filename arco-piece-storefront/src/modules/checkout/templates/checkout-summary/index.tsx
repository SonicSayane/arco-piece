import { Heading } from "@medusajs/ui"

import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"

const CheckoutSummary = ({ cart }: { cart: any }) => {
  return (
    <div className="small:sticky small:top-6 flex flex-col-reverse small:flex-col gap-y-8 py-4 small:py-0">
      <div className="w-full rounded-3xl border border-arc-divider bg-arc-surface p-5 small:p-6 shadow-[0_10px_25px_rgba(15,23,42,0.06)] flex flex-col">
        <Divider className="my-4 small:hidden" />
        <Heading
          level="h2"
          className="font-display text-2xl small:text-3xl text-arc-ink"
        >
          Dans votre panier
        </Heading>
        <Divider className="my-4" />
        <CartTotals totals={cart} />
        <ItemsPreviewTemplate cart={cart} />
        <div className="mt-6">
          <DiscountCode cart={cart} />
        </div>
      </div>
    </div>
  )
}

export default CheckoutSummary
