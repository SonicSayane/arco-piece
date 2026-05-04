"use client"

import { HttpTypes } from "@medusajs/types"
import { reorderFromOrder } from "@lib/data/cart"
import { notify } from "@lib/util/notify"
import ArcButton from "@modules/common/components/arc-button"
import { useParams, useRouter } from "next/navigation"
import { useState, useTransition } from "react"

type Props = {
  order: HttpTypes.StoreOrder
  className?: string
}

const ReorderButton = ({ order, className }: Props) => {
  const params = useParams<{ countryCode?: string }>()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = () => {
    const countryCode =
      typeof params?.countryCode === "string" ? params.countryCode : ""

    if (!countryCode) {
      notify.error("Région inconnue, impossible de recommander.")
      return
    }

    setIsLoading(true)
    startTransition(async () => {
      try {
        const result = await reorderFromOrder({ order, countryCode })

        if (result.added === 0) {
          notify.error("Aucun article n'a pu être ajouté au panier.")
          return
        }

        if (result.skipped > 0) {
          notify.warning(
            `${result.added} article(s) ajouté(s)`,
            { description: `${result.skipped} indisponible(s)` }
          )
        } else {
          notify.success(`${result.added} article(s) ajouté(s) au panier`)
        }

        router.push(`/${countryCode}/cart`)
      } catch {
        notify.error("Une erreur est survenue. Réessayez.")
      } finally {
        setIsLoading(false)
      }
    })
  }

  const busy = isPending || isLoading

  return (
    <ArcButton
      type="button"
      variant="secondary"
      onClick={handleClick}
      disabled={busy}
      isLoading={busy}
      className={className}
      data-testid="reorder-button"
    >
      {busy ? "Ajout au panier…" : "Recommander"}
    </ArcButton>
  )
}

export default ReorderButton
