import { Heading, Text, clx } from "@medusajs/ui"
import * as React from "react"

type AccentColor = "orange" | "sky" | "outline"

const accentBackdrop: Record<AccentColor, string> = {
  orange: "bg-[rgba(194,65,12,0.18)] blur-2xl",
  sky: "bg-[rgba(14,165,233,0.16)] blur-2xl",
  outline: "border border-arc-divider",
}

type ArcCardProps = {
  eyebrow?: string
  title?: string
  description?: string
  accent?: AccentColor
  accentPosition?: "tl" | "tr" | "bl" | "br"
  className?: string
  children?: React.ReactNode
  footer?: React.ReactNode
  as?: "article" | "section" | "div"
  animationDelayClass?: string
}

const positionClasses: Record<NonNullable<ArcCardProps["accentPosition"]>, string> = {
  tl: "-left-6 -top-8",
  tr: "-right-8 -top-8",
  bl: "-left-6 -bottom-10",
  br: "right-4 bottom-1",
}

const ArcCard = ({
  eyebrow,
  title,
  description,
  accent,
  accentPosition = "tr",
  className,
  children,
  footer,
  as: Tag = "article",
  animationDelayClass,
}: ArcCardProps) => {
  return (
    <Tag
      className={clx(
        "relative overflow-hidden rounded-3xl border border-arc-divider bg-arc-surface p-5 shadow-[0_10px_25px_rgba(15,23,42,0.08)] animate-arc-fade-up",
        animationDelayClass,
        className
      )}
    >
      {accent && (
        <div
          aria-hidden="true"
          className={clx(
            "absolute h-24 w-24 rounded-full",
            accentBackdrop[accent],
            positionClasses[accentPosition]
          )}
        />
      )}
      {eyebrow && (
        <Text className="font-body text-xs uppercase tracking-[0.14em] text-[var(--arc-accent)]">
          {eyebrow}
        </Text>
      )}
      {title && (
        <Heading
          level="h3"
          className="font-display mt-2 text-2xl text-arc-ink"
        >
          {title}
        </Heading>
      )}
      {description && (
        <Text className="font-body mt-2 text-sm text-arc-muted">
          {description}
        </Text>
      )}
      {children}
      {footer && <div className="mt-4">{footer}</div>}
    </Tag>
  )
}

export default ArcCard
