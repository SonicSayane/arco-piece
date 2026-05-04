import { Dialog, Transition } from "@headlessui/react"
import { clx } from "@medusajs/ui"
import React, { Fragment, useMemo } from "react"

import useToggleState from "@lib/hooks/use-toggle-state"
import ArcButton from "@modules/common/components/arc-button"
import ChevronDown from "@modules/common/icons/chevron-down"
import X from "@modules/common/icons/x"

import { getProductPrice } from "@lib/util/get-product-price"
import OptionSelect from "./option-select"
import { HttpTypes } from "@medusajs/types"
import { isSimpleProduct } from "@lib/util/product"

type MobileActionsProps = {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
  options: Record<string, string | undefined>
  updateOptions: (title: string, value: string) => void
  inStock?: boolean
  handleAddToCart: () => void
  isAdding?: boolean
  show: boolean
  optionsDisabled: boolean
}

const MobileActions: React.FC<MobileActionsProps> = ({
  product,
  variant,
  options,
  updateOptions,
  inStock,
  handleAddToCart,
  isAdding,
  show,
  optionsDisabled,
}) => {
  const { state, open, close } = useToggleState()

  const price = getProductPrice({
    product: product,
    variantId: variant?.id,
  })

  const selectedPrice = useMemo(() => {
    if (!price) {
      return null
    }
    const { variantPrice, cheapestPrice } = price

    return variantPrice || cheapestPrice || null
  }, [price])

  const isSimple = isSimpleProduct(product)

  return (
    <>
      <div
        className={clx("small:hidden inset-x-0 bottom-16 fixed z-40", {
          "pointer-events-none": !show,
        })}
      >
        <Transition
          as={Fragment}
          show={show}
          enter="ease-out duration-200"
          enterFrom="opacity-0 translate-y-2"
          enterTo="opacity-100 translate-y-0"
          leave="ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-2"
        >
          <div
            className="border-t border-arc-divider bg-arc-surface/95 backdrop-blur supports-[backdrop-filter]:bg-arc-surface/80 px-4 py-3"
            data-testid="mobile-actions"
          >
            <div className="flex items-center justify-between gap-3 mb-2">
              <span
                className="font-body text-sm font-semibold text-arc-ink truncate"
                data-testid="mobile-title"
              >
                {product.title}
              </span>
              {selectedPrice ? (
                <div className="flex items-baseline gap-2 flex-shrink-0">
                  {selectedPrice.price_type === "sale" && (
                    <span className="line-through text-xs text-arc-muted">
                      {selectedPrice.original_price}
                    </span>
                  )}
                  <span
                    className={clx("text-sm font-semibold", {
                      "text-[var(--arc-accent)]":
                        selectedPrice.price_type === "sale",
                      "text-arc-ink": selectedPrice.price_type !== "sale",
                    })}
                  >
                    {selectedPrice.calculated_price}
                  </span>
                </div>
              ) : null}
            </div>
            <div
              className={clx("grid grid-cols-2 gap-2", {
                "!grid-cols-1": isSimple,
              })}
            >
              {!isSimple && (
                <ArcButton
                  type="button"
                  onClick={open}
                  variant="secondary"
                  size="md"
                  asPill={false}
                  data-testid="mobile-actions-button"
                  className="w-full"
                >
                  <span className="flex items-center justify-between w-full">
                    <span className="truncate">
                      {variant
                        ? Object.values(options).join(" / ")
                        : "Choisir"}
                    </span>
                    <ChevronDown />
                  </span>
                </ArcButton>
              )}
              <ArcButton
                type="button"
                onClick={handleAddToCart}
                disabled={!inStock || !variant}
                isLoading={isAdding}
                variant="primary"
                size="md"
                asPill={false}
                data-testid="mobile-cart-button"
                className="w-full"
              >
                {!variant
                  ? "Choisir une variante"
                  : !inStock
                    ? "Rupture de stock"
                    : "Ajouter au panier"}
              </ArcButton>
            </div>
          </div>
        </Transition>
      </div>
      <Transition appear show={state} as={Fragment}>
        <Dialog as="div" className="relative z-[75]" onClose={close}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed bottom-0 inset-x-0">
            <div className="flex min-h-full h-full items-end justify-center text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4"
                enterTo="opacity-100 translate-y-0"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-4"
              >
                <Dialog.Panel
                  className="w-full transform overflow-hidden text-left flex flex-col gap-y-3"
                  data-testid="mobile-actions-modal"
                >
                  <div className="w-full flex justify-end pr-4 pb-3">
                    <button
                      type="button"
                      onClick={close}
                      className="bg-arc-surface border border-arc-divider w-11 h-11 rounded-full text-arc-ink flex justify-center items-center hover:bg-arc-surface-strong transition-colors"
                      data-testid="close-modal-button"
                      aria-label="Fermer"
                    >
                      <X />
                    </button>
                  </div>
                  <div className="bg-arc-surface px-6 py-8 rounded-t-3xl border-t border-arc-divider">
                    {(product.variants?.length ?? 0) > 1 && (
                      <div className="flex flex-col gap-y-6">
                        {(product.options || []).map((option) => {
                          return (
                            <div key={option.id}>
                              <OptionSelect
                                option={option}
                                current={options[option.id]}
                                updateOption={updateOptions}
                                title={option.title ?? ""}
                                disabled={optionsDisabled}
                              />
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default MobileActions
