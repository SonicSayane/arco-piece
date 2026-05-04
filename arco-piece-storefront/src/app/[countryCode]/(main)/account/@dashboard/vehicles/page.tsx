import { Metadata } from "next"

import { getVehicles } from "@lib/data/vehicles"
import VehiclesManager from "@modules/account/components/vehicles-manager"

export const metadata: Metadata = {
  title: "Mes véhicules",
  description: "Sauvegardez vos véhicules pour pré-filtrer le catalogue.",
}

export default async function VehiclesPage() {
  const vehicles = await getVehicles()

  return (
    <div className="w-full" data-testid="vehicles-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-2">
        <h1 className="font-display text-2xl text-arc-ink">Mes véhicules</h1>
        <p className="font-body text-sm text-arc-muted">
          Le véhicule principal pré-remplit le sélecteur sur la page
          d’accueil. Vous pouvez en sauvegarder jusqu’à 5.
        </p>
      </div>
      <VehiclesManager initialVehicles={vehicles} />
    </div>
  )
}
