import { Suspense } from "react"

import { retrieveCustomer } from "@lib/data/customer"
import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import Image from "next/image"

export default async function Nav() {
  const [regions, locales, currentLocale, customer] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
    retrieveCustomer().catch(() => null),
  ])

  const accountDisplayName = customer
    ? `${customer.first_name ?? ""} ${customer.last_name ?? ""}`.trim() ||
      customer.email?.split("@")[0] ||
      "Compte"
    : "Se connecter"

  const userInitials = customer
    ? `${customer.first_name?.[0] ?? ""}${customer.last_name?.[0] ?? ""}`
        .trim()
        .toUpperCase() || accountDisplayName[0]?.toUpperCase() || "C"
    : ""

  return (
    <div className="sticky top-0 inset-x-0 z-50">
      <header className="h-16 border-b border-arc-divider bg-arc-surface animate-arc-fade-in">
        <nav className="content-container flex items-center justify-between w-full h-full text-small-regular font-body text-arc-muted">
          <div className="flex-1 basis-0 h-full flex items-center">
            <div className="h-full">
              <SideMenu
                regions={regions}
                locales={locales}
                currentLocale={currentLocale}
              />
            </div>
          </div>

          <div className="flex items-center h-full">
            <LocalizedClientLink
              href="/"
              className="inline-flex items-center gap-x-2 rounded-lg px-2 py-1 hover:bg-arc-surface-strong transition-colors"
              data-testid="nav-store-link"
            >
              <Image
                src="/arco-piece-svg.svg"
                alt="Arco-Piece"
                width={40}
                height={40}
                priority
                className="h-9 w-9 object-contain"
              />
              <span className="font-display text-lg small:text-xl text-arc-ink tracking-[-0.02em]">
                Arco-Piece
              </span>
            </LocalizedClientLink>
          </div>

          <div className="flex items-center gap-x-4 small:gap-x-5 h-full flex-1 basis-0 justify-end">
            {customer ? (
              <LocalizedClientLink
                className="hidden small:inline-flex items-center gap-x-2 rounded-full border border-arc-divider bg-arc-surface px-2.5 py-1.5 hover:bg-arc-surface-strong transition-colors"
                href="/account"
                data-testid="nav-account-link"
                title={accountDisplayName}
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--arc-accent)] text-white text-[10px] font-bold">
                  {userInitials}
                </span>
                <span className="max-w-[9.5rem] truncate text-xs font-semibold tracking-[0.04em] text-arc-ink">
                  {accountDisplayName}
                </span>
              </LocalizedClientLink>
            ) : (
              <LocalizedClientLink
                className="hidden small:inline-flex items-center rounded-full border border-arc-divider bg-arc-surface px-3 py-1.5 text-xs font-semibold tracking-[0.04em] text-arc-ink hover:bg-arc-surface-strong transition-colors"
                href="/account"
                data-testid="nav-account-link"
                title={accountDisplayName}
              >
                {accountDisplayName}
              </LocalizedClientLink>
            )}
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-arc-ink flex gap-2 transition-colors font-semibold"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Panier (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
