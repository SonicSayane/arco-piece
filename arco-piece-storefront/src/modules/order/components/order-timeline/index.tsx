import { HttpTypes } from "@medusajs/types"
import { Text, clx } from "@medusajs/ui"

type Stage = {
  key: string
  label: string
  description: string
}

const STAGES: Stage[] = [
  {
    key: "placed",
    label: "Commande passée",
    description: "Nous avons bien reçu votre commande.",
  },
  {
    key: "paid",
    label: "Paiement confirmé",
    description: "Votre règlement a été validé.",
  },
  {
    key: "shipped",
    label: "Expédiée",
    description: "Votre colis est en route.",
  },
  {
    key: "delivered",
    label: "Livrée",
    description: "Votre commande est arrivée à destination.",
  },
]

const getActiveIndex = (order: HttpTypes.StoreOrder): number => {
  const fulfillment = order.fulfillment_status?.toLowerCase() ?? ""
  const payment = order.payment_status?.toLowerCase() ?? ""

  if (fulfillment === "delivered") return 3
  if (fulfillment === "shipped" || fulfillment === "partially_shipped") return 2
  if (
    payment === "captured" ||
    payment === "authorized" ||
    payment === "partially_captured"
  ) {
    return 1
  }
  return 0
}

const dotClass = (state: "done" | "current" | "pending") => {
  if (state === "done") {
    return "bg-[var(--arc-accent)] text-white border-[var(--arc-accent)]"
  }
  if (state === "current") {
    return "bg-arc-surface text-[var(--arc-accent)] border-[var(--arc-accent)] animate-pulse"
  }
  return "bg-arc-surface text-arc-muted border-arc-divider"
}

const lineClass = (done: boolean) =>
  done ? "bg-[var(--arc-accent)]" : "bg-arc-divider"

type Props = {
  order: HttpTypes.StoreOrder
}

const OrderTimeline = ({ order }: Props) => {
  const activeIndex = getActiveIndex(order)

  return (
    <section
      aria-label="Statut de la commande"
      className="rounded-2xl border border-arc-divider bg-arc-surface px-4 py-5 small:px-6 small:py-6"
    >
      <Text className="font-display text-base small:text-lg text-arc-ink mb-5">
        Suivi de votre commande
      </Text>

      <ol className="grid grid-cols-1 gap-y-5 small:grid-cols-4 small:gap-y-0 small:gap-x-2">
        {STAGES.map((stage, index) => {
          const state: "done" | "current" | "pending" =
            index < activeIndex
              ? "done"
              : index === activeIndex
                ? "current"
                : "pending"

          const isLast = index === STAGES.length - 1

          return (
            <li key={stage.key} className="relative flex small:flex-col gap-3">
              <div className="flex small:flex-col items-center small:items-start small:w-full">
                <span
                  aria-hidden="true"
                  className={clx(
                    "flex h-8 w-8 flex-none items-center justify-center rounded-full border-2 text-xs font-semibold",
                    dotClass(state)
                  )}
                >
                  {state === "done" ? (
                    <svg
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </span>
                {!isLast && (
                  <span
                    aria-hidden="true"
                    className={clx(
                      "ml-3 h-0.5 flex-1 small:ml-0 small:mt-3 small:h-0.5 small:w-full",
                      lineClass(index < activeIndex)
                    )}
                  />
                )}
              </div>

              <div className="min-w-0 flex-1 pb-1 small:pb-0 small:pt-3">
                <Text
                  className={clx(
                    "font-body text-sm font-semibold",
                    state === "pending" ? "text-arc-muted" : "text-arc-ink"
                  )}
                >
                  {stage.label}
                </Text>
                <Text className="font-body mt-0.5 text-xs text-arc-muted">
                  {stage.description}
                </Text>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

export default OrderTimeline
