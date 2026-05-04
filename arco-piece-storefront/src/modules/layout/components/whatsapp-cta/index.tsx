"use client"

import { clx } from "@medusajs/ui"
import { useEffect, useState } from "react"

type WhatsappCtaProps = {
  phone?: string
  message?: string
}

const sanitizePhone = (phone: string) => phone.replace(/[^\d]/g, "")

const WhatsappCta = ({
  phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE,
  message = "Bonjour Arco-Piece, j'ai une question sur une pièce.",
}: WhatsappCtaProps) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!phone) {
    return null
  }

  const sanitized = sanitizePhone(phone)
  if (!sanitized) {
    return null
  }

  const href = `https://wa.me/${sanitized}?text=${encodeURIComponent(message)}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contacter Arco-Piece sur WhatsApp"
      className={clx(
        "fixed bottom-20 small:bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-200",
        "bg-[#25D366] hover:scale-105 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2",
        mounted ? "opacity-100" : "opacity-0"
      )}
    >
      <svg
        viewBox="0 0 32 32"
        className="h-7 w-7 text-white"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M16.003 3C9.374 3 4 8.374 4 15.003c0 2.117.553 4.183 1.6 6.003L4 29l8.181-1.566a11.97 11.97 0 0 0 3.822.628h.005C22.626 28.062 28 22.687 28 16.058 28 12.84 26.748 9.815 24.474 7.54A11.93 11.93 0 0 0 16.003 3Zm0 21.879h-.004a9.928 9.928 0 0 1-3.79-.79l-.272-.108-4.853.929.937-4.737-.118-.282a9.93 9.93 0 0 1-.85-3.999c0-5.494 4.476-9.97 9.97-9.97 2.664 0 5.166 1.04 7.05 2.926a9.886 9.886 0 0 1 2.92 7.054c-.004 5.495-4.48 9.977-9.974 9.977Zm5.46-7.467c-.298-.15-1.768-.873-2.041-.972-.273-.1-.473-.15-.673.15-.198.298-.77.972-.945 1.171-.174.198-.348.224-.646.075-.298-.15-1.26-.464-2.4-1.481-.886-.79-1.484-1.766-1.658-2.064-.173-.298-.018-.46.131-.609.135-.135.298-.348.448-.522.149-.174.198-.298.298-.497.099-.198.05-.373-.025-.522-.074-.149-.673-1.622-.922-2.222-.243-.583-.49-.504-.673-.513l-.572-.01a1.103 1.103 0 0 0-.797.373c-.273.298-1.045 1.022-1.045 2.494 0 1.471 1.07 2.892 1.219 3.09.149.198 2.105 3.213 5.103 4.508.713.308 1.27.491 1.703.629.715.227 1.366.196 1.881.119.574-.086 1.768-.722 2.018-1.42.249-.696.249-1.292.174-1.42-.075-.124-.273-.198-.572-.348Z" />
      </svg>
    </a>
  )
}

export default WhatsappCta
