"use client"

import {
  addVehicle,
  promoteVehicle,
  removeVehicle,
  type SavedVehicle,
  type VehicleActionState,
} from "@lib/data/vehicles"
import { notify } from "@lib/util/notify"
import { Heading, Text } from "@medusajs/ui"
import ArcButton from "@modules/common/components/arc-button"
import EmptyState from "@modules/common/components/empty-state"
import Input from "@modules/common/components/input"
import { useActionState, useEffect, useRef, useTransition } from "react"

type Props = {
  initialVehicles: SavedVehicle[]
}

const initialState: VehicleActionState = {
  success: false,
  error: null,
}

const VehiclesManager = ({ initialVehicles }: Props) => {
  const [state, formAction] = useActionState(addVehicle, initialState)
  const [, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset()
      notify.success("Véhicule ajouté")
    } else if (state.error) {
      notify.error(state.error)
    }
  }, [state])

  const handleRemove = (vehicle: SavedVehicle) => {
    startTransition(async () => {
      await removeVehicle(vehicle.id)
      notify.info(`${vehicle.brand} retiré de vos véhicules`)
    })
  }

  const handlePromote = (vehicle: SavedVehicle) => {
    startTransition(async () => {
      await promoteVehicle(vehicle.id)
      notify.success(`${vehicle.brand} défini comme véhicule principal`)
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <form
        ref={formRef}
        action={formAction}
        className="rounded-3xl border border-arc-divider bg-arc-surface p-5 small:p-6"
      >
        <Heading
          level="h2"
          className="font-display text-lg small:text-xl text-arc-ink mb-1"
        >
          Ajouter un véhicule
        </Heading>
        <Text className="text-sm text-arc-muted mb-4">
          Sauvegardez votre véhicule pour retrouver les pièces compatibles
          plus rapidement.
        </Text>
        <div className="grid grid-cols-1 small:grid-cols-3 gap-3">
          <Input label="Marque" name="brand" required autoComplete="off" />
          <Input label="Modèle" name="model" autoComplete="off" />
          <Input label="Année" name="year" inputMode="numeric" />
        </div>
        <div className="mt-4 flex justify-end">
          <ArcButton type="submit" variant="primary">
            Ajouter
          </ArcButton>
        </div>
      </form>

      {initialVehicles.length === 0 ? (
        <EmptyState
          size="md"
          title="Aucun véhicule sauvegardé"
          description="Ajoutez votre premier véhicule pour pré-filtrer le catalogue."
        />
      ) : (
        <ul className="grid grid-cols-1 small:grid-cols-2 gap-3 small:gap-4">
          {initialVehicles.map((vehicle, index) => {
            const isPrimary = index === 0
            const subtitle = [vehicle.model, vehicle.year]
              .filter(Boolean)
              .join(" · ")
            return (
              <li
                key={vehicle.id}
                className="rounded-2xl border border-arc-divider bg-arc-surface p-4 small:p-5 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display text-lg text-arc-ink">
                        {vehicle.brand}
                      </span>
                      {isPrimary && (
                        <span className="inline-flex items-center rounded-full bg-[var(--arc-accent-soft)] text-[var(--arc-accent)] text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                          Principal
                        </span>
                      )}
                    </div>
                    {subtitle && (
                      <Text className="text-sm text-arc-muted mt-0.5">
                        {subtitle}
                      </Text>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {!isPrimary && (
                    <ArcButton
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handlePromote(vehicle)}
                    >
                      Définir comme principal
                    </ArcButton>
                  )}
                  <ArcButton
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemove(vehicle)}
                  >
                    Retirer
                  </ArcButton>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default VehiclesManager
