import { HttpTypes } from "@medusajs/types"

const LOW_STOCK_THRESHOLD = 5

type Props = {
  variant?: HttpTypes.StoreProductVariant
  className?: string
}

const StockUrgency = ({ variant, className }: Props) => {
  if (!variant) return null
  if (!variant.manage_inventory) return null
  if (variant.allow_backorder) return null

  const qty = variant.inventory_quantity
  if (qty == null) return null

  // Out of stock — handled separately by the add-to-cart button.
  if (qty <= 0) return null

  if (qty > LOW_STOCK_THRESHOLD) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className={
        "inline-flex items-center gap-2 rounded-full border border-[var(--arc-accent)] bg-[var(--arc-accent-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--arc-accent)] " +
        (className ?? "")
      }
    >
      <span
        aria-hidden="true"
        className="relative flex h-2 w-2"
      >
        <span className="absolute inset-0 inline-flex h-full w-full animate-ping rounded-full bg-[var(--arc-accent)] opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--arc-accent)]" />
      </span>
      <span>
        {qty === 1 ? "Plus qu’1 en stock" : `Plus que ${qty} en stock`}
      </span>
    </div>
  )
}

export default StockUrgency
