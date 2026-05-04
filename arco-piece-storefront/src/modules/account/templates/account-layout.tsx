import React from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

import AccountNav from "../components/account-nav"
import { HttpTypes } from "@medusajs/types"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
}) => {
  return (
    <div className="flex-1 py-8 small:py-12" data-testid="account-page">
      <div className="content-container max-w-5xl mx-auto rounded-3xl border border-arc-divider bg-arc-surface flex flex-col">
        <div className="grid grid-cols-1 small:grid-cols-[240px_1fr] py-8 small:py-12 px-5 small:px-8 gap-6">
          <div>{customer && <AccountNav customer={customer} />}</div>
          <div className="flex-1">{children}</div>
        </div>
        <div className="flex flex-col small:flex-row items-start small:items-center justify-between border-t border-arc-divider px-5 small:px-8 py-6 gap-4">
          <div>
            <h3 className="font-display text-lg text-arc-ink mb-2">
              Une question ?
            </h3>
            <span className="text-sm text-arc-muted">
              Retrouvez nos réponses aux questions fréquentes sur la page
              service client.
            </span>
          </div>
          <LocalizedClientLink
            href="/customer-service"
            className="text-sm font-semibold text-[var(--arc-accent)] underline"
          >
            Service client
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}

export default AccountLayout
