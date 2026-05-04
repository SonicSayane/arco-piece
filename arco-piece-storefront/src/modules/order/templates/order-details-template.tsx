"use client"

import { XMark } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OrderDetails from "@modules/order/components/order-details"
import OrderSummary from "@modules/order/components/order-summary"
import OrderTimeline from "@modules/order/components/order-timeline"
import ReorderButton from "@modules/order/components/reorder-button"
import ShippingDetails from "@modules/order/components/shipping-details"
import React from "react"

type OrderDetailsTemplateProps = {
  order: HttpTypes.StoreOrder
}

const OrderDetailsTemplate: React.FC<OrderDetailsTemplateProps> = ({
  order,
}) => {
  return (
    <div className="flex flex-col justify-center gap-y-4">
      <div className="flex flex-wrap gap-3 justify-between items-center">
        <h1 className="font-display text-2xl text-arc-ink">
          Détails de la commande
        </h1>
        <div className="flex items-center gap-3">
          <ReorderButton order={order} />
          <LocalizedClientLink
            href="/account/orders"
            className="flex gap-2 items-center text-ui-fg-subtle hover:text-ui-fg-base"
            data-testid="back-to-overview-button"
          >
            <XMark /> Retour à la liste
          </LocalizedClientLink>
        </div>
      </div>
      <div
        className="flex flex-col gap-4 h-full w-full"
        data-testid="order-details-container"
      >
        <OrderTimeline order={order} />
        <OrderDetails order={order} showStatus />
        <Items order={order} />
        <ShippingDetails order={order} />
        <OrderSummary order={order} />
        <Help />
      </div>
    </div>
  )
}

export default OrderDetailsTemplate
