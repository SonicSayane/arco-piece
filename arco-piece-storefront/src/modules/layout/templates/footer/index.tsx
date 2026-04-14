import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { Text, clx } from "@medusajs/ui"
import Image from "next/image"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import MedusaCTA from "@modules/layout/components/medusa-cta"

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "id,handle,title",
  })
  const productCategories = await listCategories()

  return (
    <footer className="mt-12 border-t border-arc-divider w-full">
      <div className="content-container w-full py-14 small:py-16">
        <div className="arc-panel rounded-3xl px-6 py-8 small:px-10 small:py-10">
          <div className="grid grid-cols-1 large:grid-cols-[1.15fr_2fr] gap-10">
            <div className="flex flex-col gap-4">
              <LocalizedClientLink href="/" className="inline-flex w-fit items-center gap-x-2">
                <Image
                  src="/arco-piece-svg.svg"
                  alt="Arco-Piece"
                  width={44}
                  height={44}
                  className="h-10 w-10 object-contain"
                />
                <span className="font-display text-2xl text-arc-ink tracking-[-0.02em]">
                  Arco-Piece
                </span>
              </LocalizedClientLink>
              <Text className="text-small-regular text-arc-muted max-w-sm">
                Arco-Piece centralise les pieces auto, moto, scooter et quad
                avec une navigation claire et un achat rapide.
              </Text>
              <LocalizedClientLink
                href="/store"
                className="inline-flex w-fit rounded-full border border-arc-divider bg-arc-surface px-4 py-2 text-xs font-semibold tracking-[0.08em] text-arc-ink hover:bg-arc-surface-strong transition-colors"
              >
                Explorer le catalogue
              </LocalizedClientLink>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-small-regular">
              {productCategories && productCategories?.length > 0 && (
                <div className="flex flex-col gap-y-2">
                  <span className="font-semibold text-arc-ink uppercase tracking-[0.08em] text-xs">
                    Categories
                  </span>
                  <ul
                    className="grid grid-cols-1 gap-2"
                    data-testid="footer-categories"
                  >
                    {productCategories?.slice(0, 6).map((c) => {
                      if (c.parent_category) {
                        return
                      }

                      const children =
                        c.category_children?.map((child) => ({
                          name: child.name,
                          handle: child.handle,
                          id: child.id,
                        })) || null

                      return (
                        <li
                          className="flex flex-col gap-2 text-arc-muted"
                          key={c.id}
                        >
                          <LocalizedClientLink
                            className={clx(
                              "hover:text-[var(--arc-accent)] transition-colors",
                              children && "font-semibold text-arc-ink"
                            )}
                            href={`/categories/${c.handle}`}
                            data-testid="category-link"
                          >
                            {c.name}
                          </LocalizedClientLink>
                          {children && (
                            <ul className="grid grid-cols-1 ml-3 gap-2">
                              {children &&
                                children.map((child) => (
                                  <li key={child.id}>
                                    <LocalizedClientLink
                                      className="hover:text-[var(--arc-accent)] transition-colors"
                                      href={`/categories/${child.handle}`}
                                      data-testid="category-link"
                                    >
                                      {child.name}
                                    </LocalizedClientLink>
                                  </li>
                                ))}
                            </ul>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
              {collections && collections.length > 0 && (
                <div className="flex flex-col gap-y-2">
                  <span className="font-semibold text-arc-ink uppercase tracking-[0.08em] text-xs">
                    Collections
                  </span>
                  <ul
                    className={clx("grid grid-cols-1 gap-2 text-arc-muted", {
                      "grid-cols-2": (collections?.length || 0) > 3,
                    })}
                  >
                    {collections?.slice(0, 6).map((c) => (
                      <li key={c.id}>
                        <LocalizedClientLink
                          className="hover:text-[var(--arc-accent)] transition-colors"
                          href={`/collections/${c.handle}`}
                        >
                          {c.title}
                        </LocalizedClientLink>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex flex-col gap-y-2">
                <span className="font-semibold text-arc-ink uppercase tracking-[0.08em] text-xs">
                  Arco-Piece
                </span>
                <ul className="grid grid-cols-1 gap-y-2 text-arc-muted">
                  <li>
                    <LocalizedClientLink
                      href="/"
                      className="hover:text-[var(--arc-accent)] transition-colors"
                    >
                      Accueil
                    </LocalizedClientLink>
                  </li>
                  <li>
                    <LocalizedClientLink
                      href="/store"
                      className="hover:text-[var(--arc-accent)] transition-colors"
                    >
                      Catalogue
                    </LocalizedClientLink>
                  </li>
                  <li>
                    <LocalizedClientLink
                      href="/account"
                      className="hover:text-[var(--arc-accent)] transition-colors"
                    >
                      User
                    </LocalizedClientLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-col small:flex-row gap-y-3 justify-between border-t border-arc-divider pt-5 text-arc-muted">
            <Text className="txt-compact-small">
              © {new Date().getFullYear()} Arco-Piece. Tous droits reserves.
            </Text>
            <MedusaCTA />
          </div>
        </div>
      </div>
    </footer>
  )
}
