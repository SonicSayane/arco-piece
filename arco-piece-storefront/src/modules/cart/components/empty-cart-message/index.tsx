import ArcButton from "@modules/common/components/arc-button"
import EmptyState from "@modules/common/components/empty-state"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const EmptyCartMessage = () => {
  return (
    <div data-testid="empty-cart-message">
      <EmptyState
        size="lg"
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        }
        title="Votre panier est vide"
        description="Aucun article pour le moment. Parcourez le catalogue pour trouver les pièces qu'il vous faut."
        action={
          <LocalizedClientLink href="/store">
            <ArcButton variant="primary">Explorer le catalogue</ArcButton>
          </LocalizedClientLink>
        }
      />
    </div>
  )
}

export default EmptyCartMessage
