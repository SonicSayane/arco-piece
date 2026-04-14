"use client"

import { Popover, PopoverPanel, Transition } from "@headlessui/react"
import { ArrowRightMini, XMark } from "@medusajs/icons"
import { Text, clx, useToggleState } from "@medusajs/ui"
import { Fragment } from "react"
import Image from "next/image"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
import LanguageSelect from "../language-select"
import { HttpTypes } from "@medusajs/types"
import { Locale } from "@lib/data/locales"

type SideMenuProps = {
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
  accountLabel?: string
}

const SideMenu = ({
  regions,
  locales,
  currentLocale,
  accountLabel,
}: SideMenuProps) => {
  const countryToggleState = useToggleState()
  const languageToggleState = useToggleState()
  const sideMenuItems = [
    { key: "home", label: "Accueil", href: "/" },
    { key: "store", label: "Catalogue", href: "/store" },
    { key: "account", label: accountLabel || "Compte", href: "/account" },
    { key: "cart", label: "Panier", href: "/cart" },
  ]

  return (
    <div className="h-full">
      <div className="flex items-center h-full">
        <Popover className="h-full flex">
          {({ open, close }) => (
            <>
              <div className="relative flex h-full">
                <Popover.Button
                  data-testid="nav-menu-button"
                  className="relative h-full inline-flex items-center rounded-full border border-transparent px-3 text-sm font-semibold text-arc-ink transition-colors duration-200 focus:outline-none hover:bg-arc-surface-strong data-[headlessui-state=open]:border-arc-divider data-[headlessui-state=open]:bg-arc-surface-strong"
                >
                  Menu
                </Popover.Button>
              </div>

              {open && (
                <div
                  className="fixed inset-0 z-[50] bg-[rgba(15,23,42,0.52)] pointer-events-auto"
                  onClick={close}
                  data-testid="side-menu-backdrop"
                />
              )}

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-150"
                enterFrom="opacity-0 -translate-x-3"
                enterTo="opacity-100 translate-x-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-x-0"
                leaveTo="opacity-0 -translate-x-3"
              >
                <PopoverPanel className="fixed inset-y-0 left-0 z-[51] w-[92vw] max-w-[420px] p-3 text-sm">
                  <div
                    data-testid="nav-menu-popup"
                    className="flex h-full flex-col rounded-3xl border border-arc-divider bg-arc-surface p-5 text-arc-ink shadow-[0_24px_60px_rgba(15,23,42,0.24)]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <LocalizedClientLink
                        href="/"
                        onClick={close}
                        className="inline-flex items-center gap-x-2 rounded-lg px-2 py-1 hover:bg-arc-surface-strong transition-colors"
                        data-testid="menu-logo-link"
                      >
                        <Image
                          src="/arco-piece-svg.svg"
                          alt="Arco-Piece"
                          width={40}
                          height={40}
                          className="h-8 w-8 object-contain"
                        />
                        <span className="font-display text-lg text-arc-ink tracking-[-0.02em]">
                          Arco-Piece
                        </span>
                      </LocalizedClientLink>
                      <button
                        data-testid="close-menu-button"
                        onClick={close}
                        className="rounded-full border border-arc-divider p-2 hover:bg-arc-surface-strong transition-colors"
                      >
                        <XMark />
                      </button>
                    </div>

                    <div className="mt-5 rounded-2xl border border-arc-divider bg-arc-surface-strong px-4 py-3">
                      <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--arc-accent)]">
                        Navigation
                      </p>
                      <p className="mt-1 text-xs text-arc-muted">
                        Accedez rapidement au catalogue, a votre compte et au panier.
                      </p>
                    </div>

                    <ul className="mt-4 flex flex-col gap-2">
                      {sideMenuItems.map((item) => {
                        return (
                          <li key={item.key}>
                            <LocalizedClientLink
                              href={item.href}
                              className="group flex w-full items-center justify-between rounded-xl border border-arc-divider bg-arc-surface-strong px-4 py-3 font-body text-base font-semibold text-arc-ink hover:border-[var(--arc-accent)] hover:text-[var(--arc-accent)] transition-colors"
                              onClick={close}
                              data-testid={`${item.key}-link`}
                            >
                              <span className="max-w-[14.5rem] truncate">{item.label}</span>
                              <ArrowRightMini className="opacity-65 group-hover:opacity-100 transition-opacity" />
                            </LocalizedClientLink>
                          </li>
                        )
                      })}
                    </ul>

                    <div className="mt-auto pt-5">
                      <div className="rounded-2xl border border-arc-divider bg-arc-surface-strong p-4">
                        <div className="flex flex-col gap-y-3">
                          {!!locales?.length && (
                            <div
                              className="flex items-center justify-between rounded-xl border border-arc-divider bg-arc-surface px-3 py-2 text-arc-ink"
                              onMouseEnter={languageToggleState.open}
                              onMouseLeave={languageToggleState.close}
                            >
                              <LanguageSelect
                                toggleState={languageToggleState}
                                locales={locales}
                                currentLocale={currentLocale}
                              />
                              <ArrowRightMini
                                className={clx(
                                  "transition-transform duration-150",
                                  languageToggleState.state ? "-rotate-90" : ""
                                )}
                              />
                            </div>
                          )}
                          <div
                            className="flex items-center justify-between rounded-xl border border-arc-divider bg-arc-surface px-3 py-2 text-arc-ink"
                            onMouseEnter={countryToggleState.open}
                            onMouseLeave={countryToggleState.close}
                          >
                            {regions && (
                              <CountrySelect
                                toggleState={countryToggleState}
                                regions={regions}
                              />
                            )}
                            <ArrowRightMini
                              className={clx(
                                "transition-transform duration-150",
                                countryToggleState.state ? "-rotate-90" : ""
                              )}
                            />
                          </div>
                        </div>
                      </div>

                      <Text className="mt-3 flex justify-between txt-compact-small text-arc-muted">
                        © {new Date().getFullYear()} Arco-Piece. Tous droits reserves.
                      </Text>
                    </div>
                  </div>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default SideMenu
