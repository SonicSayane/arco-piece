"use client"

import ArcButton from "@modules/common/components/arc-button"
import EmptyState from "@modules/common/components/empty-state"
import OrderCard from "../order-card"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

const OrderOverview = ({ orders }: { orders: HttpTypes.StoreOrder[] }) => {
  if (orders?.length) {
    return (
      <div className="flex flex-col gap-y-6 w-full">
        {orders.map((o) => (
          <OrderCard key={o.id} order={o} />
        ))}
      </div>
    )
  }

  return (
    <EmptyState
      size="md"
      title="Aucune commande pour le moment"
      description="Vous n’avez pas encore passé de commande. Explorez le catalogue pour commencer."
      action={
        <LocalizedClientLink href="/store">
          <ArcButton variant="primary" data-testid="continue-shopping-button">
            Explorer le catalogue
          </ArcButton>
        </LocalizedClientLink>
      }
    />
  )
}

export default OrderOverview
