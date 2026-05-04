import { Metadata } from "next"

import EmptyState from "@modules/common/components/empty-state"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ArcButton from "@modules/common/components/arc-button"

export const metadata: Metadata = {
  title: "Page introuvable",
  description: "La page que vous cherchez n'existe pas ou a été déplacée.",
}

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-arc-surface">
      <EmptyState
        size="lg"
        icon={
          <span className="font-display text-3xl font-bold tracking-[-0.02em]">
            404
          </span>
        }
        title="Cette page roule en panne"
        description="La page que vous cherchez n'existe pas ou a été déplacée. Reprenez la route depuis l'accueil ou explorez le catalogue."
        action={
          <LocalizedClientLink href="/">
            <ArcButton variant="primary">Retour à l'accueil</ArcButton>
          </LocalizedClientLink>
        }
        secondaryAction={
          <LocalizedClientLink href="/store">
            <ArcButton variant="outline">Voir le catalogue</ArcButton>
          </LocalizedClientLink>
        }
      />
    </div>
  )
}
