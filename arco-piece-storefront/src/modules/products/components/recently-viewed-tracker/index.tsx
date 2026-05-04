"use client"

import { pushRecentlyViewed } from "@lib/data/recently-viewed"
import { useEffect } from "react"

type Props = {
  handle: string
}

const RecentlyViewedTracker = ({ handle }: Props) => {
  useEffect(() => {
    if (!handle) return
    // Fire-and-forget; failure is non-critical (cookie unavailable, etc.).
    void pushRecentlyViewed(handle).catch(() => undefined)
  }, [handle])

  return null
}

export default RecentlyViewedTracker
