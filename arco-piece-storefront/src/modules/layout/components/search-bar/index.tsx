"use client"

import { searchProducts, type SearchSuggestion } from "@lib/data/search"
import { clx } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useParams, useRouter } from "next/navigation"
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useTransition,
} from "react"

const DEBOUNCE_MS = 200
const MIN_LENGTH = 2

const SearchIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width={18}
    height={18}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-3.5-3.5" />
  </svg>
)

type SearchLabels = {
  searchPlaceholder: string
  searchAll: string
  searchEmpty: string
}

const DEFAULT_LABELS: SearchLabels = {
  searchPlaceholder: "Rechercher une pièce, une référence OEM…",
  searchAll: "Voir tous les résultats →",
  searchEmpty: "Aucun résultat pour",
}

const SearchBar = ({
  labels = DEFAULT_LABELS,
}: { labels?: SearchLabels } = {}) => {
  const router = useRouter()
  const params = useParams<{ countryCode?: string }>()
  const countryCode =
    typeof params?.countryCode === "string" ? params.countryCode : ""

  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchSuggestion[]>([])
  const [open, setOpen] = useState(false)
  const [, startTransition] = useTransition()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const listboxId = useId()

  // Debounced fetch
  useEffect(() => {
    const trimmed = query.trim()
    if (trimmed.length < MIN_LENGTH || !countryCode) {
      setResults([])
      return
    }

    const timer = setTimeout(() => {
      startTransition(async () => {
        const suggestions = await searchProducts({
          query: trimmed,
          countryCode,
          limit: 6,
        })
        setResults(suggestions)
      })
    }, DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [query, countryCode])

  // Click outside closes the dropdown.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const submit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault()
      const trimmed = query.trim()
      if (!trimmed || !countryCode) return
      setOpen(false)
      router.push(`/${countryCode}/store?q=${encodeURIComponent(trimmed)}`)
    },
    [query, countryCode, router]
  )

  const showResults = open && query.trim().length >= MIN_LENGTH
  const hasResults = results.length > 0

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <form onSubmit={submit} role="search">
        <label className="sr-only" htmlFor="storefront-search">
          Rechercher
        </label>
        <div className="flex items-center gap-2 rounded-full border border-arc-divider bg-arc-surface px-4 h-10 focus-within:border-[var(--arc-accent)] transition-colors">
          <span className="text-arc-muted">
            <SearchIcon />
          </span>
          <input
            id="storefront-search"
            type="search"
            name="q"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            placeholder={labels.searchPlaceholder}
            className="flex-1 bg-transparent text-sm placeholder:text-arc-muted focus:outline-none"
            autoComplete="off"
          />
        </div>
      </form>

      {showResults && (
        <div
          id={listboxId}
          className={clx(
            "absolute left-0 right-0 mt-2 rounded-2xl border border-arc-divider bg-arc-surface shadow-lg overflow-hidden z-50"
          )}
        >
          {hasResults ? (
            <ul className="max-h-80 overflow-y-auto">
              {results.map((item) => (
                <li key={item.id}>
                  <LocalizedClientLink
                    href={`/products/${item.handle}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-arc-surface-strong transition-colors"
                  >
                    {item.thumbnail ? (
                      // Plain img to avoid Next/image config for arbitrary CDNs.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.thumbnail}
                        alt=""
                        className="h-10 w-10 rounded-md object-cover bg-arc-surface-strong"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-md bg-arc-surface-strong" />
                    )}
                    <span className="text-sm text-arc-ink truncate">
                      {item.title}
                    </span>
                  </LocalizedClientLink>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => submit()}
                  className="w-full px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-[var(--arc-accent)] hover:bg-arc-surface-strong transition-colors"
                >
                  {labels.searchAll}
                </button>
              </li>
            </ul>
          ) : (
            <p className="px-3 py-3 text-sm text-arc-muted">
              {labels.searchEmpty}{" "}
              <span className="font-semibold">{query}</span>.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchBar
