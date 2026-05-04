import { useMemo } from "react"

import ArcButton from "@modules/common/components/arc-button"
import Thumbnail from "@modules/products/components/thumbnail"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type OrderCardProps = {
  order: HttpTypes.StoreOrder
}

const OrderCard = ({ order }: OrderCardProps) => {
  const numberOfLines = useMemo(() => {
    return (
      order.items?.reduce((acc, item) => {
        return acc + item.quantity
      }, 0) ?? 0
    )
  }, [order])

  const numberOfProducts = useMemo(() => {
    return order.items?.length ?? 0
  }, [order])

  const formattedDate = useMemo(
    () =>
      new Date(order.created_at).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    [order]
  )

  return (
    <div
      className="rounded-2xl border border-arc-divider bg-arc-surface p-5 small:p-6 flex flex-col"
      data-testid="order-card"
    >
      <div className="font-display text-lg text-arc-ink mb-1">
        Commande #
        <span data-testid="order-display-id">{order.display_id}</span>
      </div>
      <div className="flex items-center divide-x divide-arc-divider text-sm text-arc-muted">
        <span className="pr-2" data-testid="order-created-at">
          {formattedDate}
        </span>
        <span className="px-2" data-testid="order-amount">
          {convertToLocale({
            amount: order.total,
            currency_code: order.currency_code,
          })}
        </span>
        <span className="pl-2">{`${numberOfLines} ${
          numberOfLines > 1 ? "articles" : "article"
        }`}</span>
      </div>
      <div className="grid grid-cols-2 small:grid-cols-4 gap-4 my-4">
        {order.items?.slice(0, 3).map((i) => {
          return (
            <div
              key={i.id}
              className="flex flex-col gap-y-2"
              data-testid="order-item"
            >
              <Thumbnail thumbnail={i.thumbnail} images={[]} size="full" />
              <div className="flex items-center text-sm text-arc-ink">
                <span className="font-semibold truncate" data-testid="item-title">
                  {i.title}
                </span>
                <span className="ml-2">x</span>
                <span data-testid="item-quantity">{i.quantity}</span>
              </div>
            </div>
          )
        })}
        {numberOfProducts > 4 && (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <span className="text-sm text-arc-muted">
              + {numberOfLines - 4}
            </span>
            <span className="text-sm text-arc-muted">de plus</span>
          </div>
        )}
      </div>
      <div className="flex justify-end">
        <LocalizedClientLink href={`/account/orders/details/${order.id}`}>
          <ArcButton variant="secondary" data-testid="order-details-link">
            Voir les détails
          </ArcButton>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default OrderCard
