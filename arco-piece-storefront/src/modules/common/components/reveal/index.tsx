"use client"

import { clx } from "@medusajs/ui"
import { useEffect, useRef, useState, type ReactNode } from "react"

type RevealProps = {
  children: ReactNode
  /** Tailwind delay class, e.g. "animation-delay-150". */
  delayClass?: string
  /** Render as a different element. Defaults to div. */
  as?: "div" | "section" | "li" | "article"
  className?: string
  /**
   * Threshold passed to IntersectionObserver. 0.15 means animate when
   * 15% of the element is visible.
   */
  threshold?: number
  /** Disable the once-only behavior so the animation re-triggers. */
  repeat?: boolean
}

/**
 * Wrap any block of content to fade it up when it enters the viewport.
 * Falls back to "always visible" if the IntersectionObserver isn't
 * available (very old browsers, server render, prefers-reduced-motion).
 */
const Reveal = ({
  children,
  delayClass,
  as: Tag = "div",
  className,
  threshold = 0.15,
  repeat = false,
}: RevealProps) => {
  const ref = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setVisible(true)
      return
    }

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    if (reduced) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            if (!repeat) observer.disconnect()
          } else if (repeat) {
            setVisible(false)
          }
        }
      },
      { threshold }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold, repeat])

  return (
    <Tag
      ref={ref as never}
      className={clx(
        "transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.2,0.75,0.2,1)] will-change-transform",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5",
        delayClass,
        className
      )}
    >
      {children}
    </Tag>
  )
}

export default Reveal
