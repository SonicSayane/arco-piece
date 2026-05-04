import { toast } from "@medusajs/ui"

type NotifyOptions = {
  description?: string
  duration?: number
}

export const notify = {
  success(title: string, options?: NotifyOptions) {
    toast.success(title, options)
  },
  error(title: string, options?: NotifyOptions) {
    toast.error(title, options)
  },
  info(title: string, options?: NotifyOptions) {
    toast.info(title, options)
  },
  warning(title: string, options?: NotifyOptions) {
    toast.warning(title, options)
  },
}
