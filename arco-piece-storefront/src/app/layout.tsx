import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "../styles/globals.css"

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
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body>
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
