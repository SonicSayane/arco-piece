import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder
  showStatus?: boolean
}

const FULFILLMENT_LABELS: Record<string, string> = {
  not_fulfilled: "En préparation",
  partially_fulfilled: "Partiellement préparée",
  fulfilled: "Préparée",
  partially_shipped: "Partiellement expédiée",
  shipped: "Expédiée",
  delivered: "Livrée",
  partially_returned: "Partiellement retournée",
  returned: "Retournée",
  canceled: "Annulée",
}

const PAYMENT_LABELS: Record<string, string> = {
  not_paid: "Non payée",
  awaiting: "En attente",
  authorized: "Autorisée",
  partially_authorized: "Partiellement autorisée",
  captured: "Payée",
  partially_captured: "Partiellement payée",
  refunded: "Remboursée",
  partially_refunded: "Partiellement remboursée",
  canceled: "Annulée",
  requires_action: "Action requise",
}

const labelize = (
  table: Record<string, string>,
  status: string | null | undefined
) => {
  if (!status) return "—"
  if (table[status]) return table[status]
  const formatted = status.split("_").join(" ")
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {
  return (
    <div>
      <Text>
        Nous avons envoyé la confirmation de commande à{" "}
        <span
          className="text-ui-fg-medium-plus font-semibold"
          data-testid="order-email"
        >
          {order.email}
        </span>
        .
      </Text>
      <Text className="mt-2">
        Date de commande :{" "}
        <span data-testid="order-date">
          {new Date(order.created_at).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </span>
      </Text>
      <Text className="mt-2 text-ui-fg-interactive">
        Numéro de commande :{" "}
        <span data-testid="order-id">{order.display_id}</span>
      </Text>

      <div className="flex flex-wrap items-center text-compact-small gap-x-4 gap-y-1 mt-4">
        {showStatus && (
          <>
            <Text>
              Statut :{" "}
              <span className="text-ui-fg-subtle" data-testid="order-status">
                {labelize(FULFILLMENT_LABELS, order.fulfillment_status)}
              </span>
            </Text>
            <Text>
              Paiement :{" "}
              <span
                className="text-ui-fg-subtle"
                data-testid="order-payment-status"
              >
                {labelize(PAYMENT_LABELS, order.payment_status)}
              </span>
            </Text>
          </>
        )}
      </div>
    </div>
  )
}

export default OrderDetails
