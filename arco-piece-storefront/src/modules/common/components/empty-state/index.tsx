import { Heading, Text, clx } from "@medusajs/ui"
import * as React from "react"

type EmptyStateProps = {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  secondaryAction?: React.ReactNode
  className?: string
  size?: "sm" | "md" | "lg"
}

const paddingBySize: Record<NonNullable<EmptyStateProps["size"]>, string> = {
  sm: "py-10",
  md: "py-16",
  lg: "py-24",
}

const EmptyState = ({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  size = "md",
}: EmptyStateProps) => {
  return (
    <div
      className={clx(
        "flex flex-col items-center justify-center text-center px-6",
        paddingBySize[size],
        className
      )}
    >
      {icon && (
        <div
          aria-hidden="true"
          className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-arc-surface-strong text-[var(--arc-accent)]"
        >
          {icon}
        </div>
      )}
      <Heading
        level="h2"
        className="font-display text-2xl small:text-3xl text-arc-ink"
      >
        {title}
      </Heading>
      {description && (
        <Text className="font-body mt-2 max-w-md text-sm text-arc-muted">
          {description}
        </Text>
      )}
      {(action || secondaryAction) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  )
}

export default EmptyState
