import { getBaseURL } from "@lib/util/env"
import { Toaster } from "@medusajs/ui"
import { Metadata } from "next"
import { Manrope, Space_Grotesk } from "next/font/google"
import "../styles/globals.css"

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700", "800"],
})

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: "Arco-Piece",
    template: "%s | Arco-Piece",
  },
  description:
    "Arco-Piece - boutique e-commerce de pieces mecaniques (voiture, moto, scooter, quad).",
  keywords: [
    "arco piece",
    "pieces auto",
    "pieces moto",
    "pieces scooter",
    "pieces quad",
    "reference oem",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Arco-Piece",
    title: "Arco-Piece",
    description:
      "Arco-Piece - boutique e-commerce de pieces mecaniques (voiture, moto, scooter, quad).",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arco-Piece",
    description:
      "Arco-Piece - boutique e-commerce de pieces mecaniques (voiture, moto, scooter, quad).",
  },
  icons: {
    icon: [{ url: "/arco-piece-svg.svg", type: "image/svg+xml" }],
    shortcut: ["/arco-piece-svg.svg"],
    apple: [{ url: "/arco-piece-svg.svg" }],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      data-mode="light"
      className={`${bodyFont.variable} ${displayFont.variable}`}
    >
      <body className="font-body text-arc-ink bg-arc-background antialiased">
        <main className="relative">{props.children}</main>
        <Toaster position="top-right" duration={4000} />
      </body>
    </html>
  )
}
