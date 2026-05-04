import { clx } from "@medusajs/ui"

type PaymentBadgesProps = {
  className?: string
  label?: string | null
}

const VisaLogo = () => (
  <svg viewBox="0 0 48 16" className="h-full w-auto" aria-hidden="true">
    <path
      d="M19.7 0.3 17 15.7h-4.3L15.4 0.3h4.3zm17.6 9.9 2.3-6.3 1.3 6.3h-3.6zm4.9 5.5h4l-3.5-15.4H38.9c-0.8 0-1.5 0.5-1.8 1.2L31 15.7h4.5l0.9-2.5h5.5l0.5 2.5zM30.3 10.7c0-4.4-6-4.7-6-6.7 0-0.6 0.6-1.2 1.9-1.4 0.6-0.1 2.4-0.1 4.4 0.8L31.4 0c-1.1-0.4-2.4-0.8-4.1-0.8-4.3 0-7.3 2.3-7.3 5.5 0 2.4 2.2 3.7 3.8 4.5 1.7 0.8 2.3 1.3 2.3 2 0 1.1-1.3 1.6-2.5 1.6-2.1 0-3.3-0.6-4.3-1l-0.8 3.5c1 0.5 2.9 0.9 4.8 0.9 4.6 0 7.6-2.3 7.6-5.8M13.6 0.3 6.6 15.7H2.1L-1.3 3.4C-1.6 2.6-1.7 2.4-2.5 2c-1.3-0.7-3.4-1.3-5.3-1.7l0.1-0.4h7.2c0.9 0 1.7 0.6 1.9 1.7l1.8 9.7L7.7 0.3h4.5l1.4 0z"
      fill="currentColor"
      transform="translate(8 0)"
    />
  </svg>
)

const MastercardLogo = () => (
  <svg viewBox="0 0 36 24" className="h-full w-auto" aria-hidden="true">
    <circle cx="14" cy="12" r="8" fill="#EB001B" />
    <circle cx="22" cy="12" r="8" fill="#F79E1B" />
    <path
      d="M18 5.5a8 8 0 0 1 0 13 8 8 0 0 1 0-13z"
      fill="#FF5F00"
    />
  </svg>
)

const StripeLogo = () => (
  <svg viewBox="0 0 60 25" className="h-full w-auto" aria-hidden="true">
    <path
      d="M59.6 14.1c0-4.3-2.1-7.6-6-7.6-3.9 0-6.4 3.4-6.4 7.6 0 5 2.8 7.5 6.9 7.5 2 0 3.5-0.5 4.6-1.1v-3.4c-1.1 0.6-2.4 0.9-4 0.9-1.6 0-3-0.6-3.2-2.5h8c0-0.2 0.1-1 0.1-1.4zm-8.1-1.6c0-1.8 1.1-2.6 2.1-2.6 1 0 2 0.7 2 2.6h-4.1zm-10.4-6c-1.6 0-2.7 0.8-3.3 1.3l-0.2-1.1h-3.7v19.4l4.2-0.9v-4.7c0.6 0.5 1.5 1 3 1 3 0 5.7-2.4 5.7-7.7 0-4.8-2.7-7.3-5.7-7.3zm-1 11.2c-1 0-1.6-0.4-2-0.8v-6.4c0.5-0.5 1.1-0.8 2-0.8 1.5 0 2.6 1.7 2.6 4 0 2.3-1 4-2.6 4zM26.2 5.5l4.2-0.9v-3.4l-4.2 0.9v3.4zm0 1.2h4.2v14.6h-4.2V6.7zM21.7 8l-0.3-1.3h-3.6v14.6h4.2v-9.9c1-1.3 2.7-1 3.2-0.9V6.7c-0.6-0.2-2.5-0.5-3.5 1.3zm-9.9-5.1L7.7 3.8 7.7 17.1c0 2.5 1.9 4.3 4.3 4.3 1.4 0 2.4-0.3 3-0.5v-3.4c-0.5 0.2-3.2 1-3.2-1.5V10.3h3.2V6.7h-3.2L11.8 2.9zM4.2 11c0-0.6 0.5-0.8 1.4-0.8 1.3 0 3 0.4 4.3 1.1V7.4c-1.4-0.6-2.8-0.8-4.3-0.8-3.5 0-5.9 1.8-5.9 4.9 0 4.8 6.7 4.1 6.7 6.1 0 0.7-0.6 0.9-1.6 0.9-1.4 0-3.2-0.6-4.7-1.4v3.9c1.6 0.7 3.2 1 4.7 1 3.6 0 6.1-1.8 6.1-4.9 0-5.2-6.7-4.4-6.7-6.2z"
      fill="currentColor"
    />
  </svg>
)

const MobileMoneyLogo = () => (
  <svg viewBox="0 0 36 24" className="h-full w-auto" aria-hidden="true">
    <rect x="9" y="3" width="18" height="18" rx="3" fill="currentColor" opacity="0.15" />
    <rect
      x="11"
      y="5"
      width="14"
      height="14"
      rx="2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    />
    <path
      d="M14 9h8M14 12h8M14 15h5"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <circle cx="22" cy="15" r="1.2" fill="currentColor" />
  </svg>
)

const BADGES = [
  { name: "Visa", logo: <VisaLogo /> },
  { name: "Mastercard", logo: <MastercardLogo /> },
  { name: "Stripe", logo: <StripeLogo /> },
  { name: "Mobile Money", logo: <MobileMoneyLogo /> },
]

const PaymentBadges = ({
  className,
  label = "Paiements sécurisés acceptés",
}: PaymentBadgesProps) => {
  return (
    <div
      className={clx(
        "flex flex-col gap-2 items-center small:items-start",
        className
      )}
    >
      {label && (
        <span className="text-[10px] uppercase tracking-[0.18em] text-arc-muted">
          {label}
        </span>
      )}
      <ul className="flex flex-wrap items-center gap-3">
        {BADGES.map((badge) => (
          <li
            key={badge.name}
            title={badge.name}
            className="h-7 flex items-center justify-center rounded-md border border-arc-divider bg-arc-surface px-2.5 text-arc-ink"
          >
            <span className="sr-only">{badge.name}</span>
            <span className="block h-4">{badge.logo}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PaymentBadges
