import { Metadata } from "next"
import Link from "next/link"

import ArcButton from "@modules/common/components/arc-button"
import EmptyState from "@modules/common/components/empty-state"

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
        description="La page que vous cherchez n&apos;existe pas ou a été déplacée."
        action={
          <Link href="/">
            <ArcButton variant="primary">Retour à l&apos;accueil</ArcButton>
          </Link>
        }
      />
    </div>
  )
}
