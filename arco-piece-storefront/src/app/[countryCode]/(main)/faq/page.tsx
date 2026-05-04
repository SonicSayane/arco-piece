import { Heading, Text } from "@medusajs/ui"
import { Metadata } from "next"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Reveal from "@modules/common/components/reveal"

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Réponses aux questions fréquentes sur la commande, le paiement, la livraison et les retours.",
}

type QA = { q: string; a: string }
type Section = { title: string; items: QA[] }

const SECTIONS: Section[] = [
  {
    title: "Commande",
    items: [
      {
        q: "Comment savoir si une pièce est compatible avec mon véhicule ?",
        a: "Utilisez le sélecteur de véhicule sur la page d'accueil (marque, modèle, année). Le catalogue se filtre automatiquement. Sur chaque fiche produit, la compatibilité est aussi indiquée explicitement.",
      },
      {
        q: "Puis-je modifier ma commande après l'avoir validée ?",
        a: "Tant que votre commande n'est pas en préparation, contactez-nous via WhatsApp ou par email — nous ferons le nécessaire si c'est encore possible.",
      },
      {
        q: "Comment suivre l'état de ma commande ?",
        a: "Connectez-vous à votre compte, rubrique « Commandes ». Vous y trouverez la timeline de chaque commande : payée → préparée → expédiée → livrée.",
      },
    ],
  },
  {
    title: "Paiement",
    items: [
      {
        q: "Quels moyens de paiement acceptez-vous ?",
        a: "Cartes Visa et Mastercard via Stripe, ainsi que Mobile Money (MTN, Moov, Orange selon votre pays). Toutes les transactions sont sécurisées.",
      },
      {
        q: "Est-ce que mes données bancaires sont en sécurité ?",
        a: "Oui. Nous ne stockons jamais vos données de carte. Le paiement est traité directement par Stripe (certifié PCI-DSS niveau 1).",
      },
      {
        q: "Dans quelle devise vais-je payer ?",
        a: "Selon votre région : XOF (Franc CFA), EUR (Europe) ou USD. La devise est affichée clairement avant la confirmation.",
      },
    ],
  },
  {
    title: "Livraison",
    items: [
      {
        q: "Vous livrez dans quels pays ?",
        a: "L'ensemble des 8 pays de l'UEMOA (Bénin, Burkina Faso, Côte d'Ivoire, Guinée-Bissau, Mali, Niger, Sénégal, Togo) et plusieurs pays européens.",
      },
      {
        q: "Combien de temps prend une livraison ?",
        a: "Selon la zone et le mode choisi : 24 à 72h en zone urbaine UEMOA, 5 à 10 jours pour l'international standard.",
      },
      {
        q: "La livraison est-elle gratuite à partir d'un certain montant ?",
        a: "Oui — les seuils de gratuité sont indiqués dans votre panier (« Plus que X pour la livraison gratuite »).",
      },
    ],
  },
  {
    title: "Retours et garantie",
    items: [
      {
        q: "Puis-je retourner une pièce qui ne convient pas ?",
        a: "Oui, sous 14 jours après réception, à condition que la pièce n'ait pas été montée et soit dans son emballage d'origine. Contactez le service client pour ouvrir un retour.",
      },
      {
        q: "Combien de temps dure la garantie ?",
        a: "La garantie standard est de 6 mois sur les pièces neuves, hors usure normale. Certaines références bénéficient d'une garantie étendue, indiquée sur la fiche produit.",
      },
    ],
  },
]

export default function FaqPage() {
  return (
    <div className="pb-20 small:pb-24">
      <section className="content-container py-10 small:py-16">
        <div className="max-w-3xl">
          <Text className="font-body text-xs uppercase tracking-[0.18em] text-[var(--arc-accent)]">
            Aide
          </Text>
          <Heading
            level="h1"
            className="font-display mt-3 text-3xl small:text-5xl text-arc-ink leading-tight"
          >
            Questions fréquentes
          </Heading>
          <Text className="font-body mt-4 text-base small:text-lg text-arc-muted max-w-2xl">
            Vous ne trouvez pas votre réponse ? Écrivez-nous sur{" "}
            <a
              href="mailto:support@arco-piece.com"
              className="text-[var(--arc-accent)] underline"
            >
              support@arco-piece.com
            </a>
            .
          </Text>
        </div>
      </section>

      <div className="content-container flex flex-col gap-10">
        {SECTIONS.map((section, sIndex) => (
          <Reveal key={section.title} as="section">
            <div className="rounded-3xl border border-arc-divider bg-arc-surface p-5 small:p-8">
              <Heading
                level="h2"
                className="font-display text-xl small:text-2xl text-arc-ink mb-5"
              >
                {section.title}
              </Heading>
              <ul className="flex flex-col gap-3">
                {section.items.map((item, index) => (
                  <li
                    key={item.q}
                    className="rounded-2xl border border-arc-divider bg-arc-surface-strong"
                  >
                    <details className="group">
                      <summary className="cursor-pointer list-none px-4 py-3 small:px-5 small:py-4 flex items-center justify-between gap-4 font-semibold text-sm small:text-base text-arc-ink">
                        <span>{item.q}</span>
                        <span
                          aria-hidden="true"
                          className="flex-none text-[var(--arc-accent)] transition-transform duration-200 group-open:rotate-45"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            width="18"
                            height="18"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          >
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                        </span>
                      </summary>
                      <div className="px-4 pb-4 small:px-5 small:pb-5 -mt-1 text-sm small:text-base text-arc-muted leading-relaxed">
                        {item.a}
                      </div>
                    </details>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal as="section" className="content-container mt-10">
        <div className="rounded-3xl border border-arc-divider bg-arc-surface p-6 small:p-10 text-center">
          <Heading
            level="h2"
            className="font-display text-2xl small:text-3xl text-arc-ink"
          >
            Besoin d’aide pour identifier une pièce ?
          </Heading>
          <Text className="font-body mt-3 text-arc-muted max-w-xl mx-auto">
            Le sélecteur de véhicule sur la page d’accueil filtre le catalogue
            par marque, modèle et année.
          </Text>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <LocalizedClientLink
              href="/"
              className="inline-flex rounded-full bg-[var(--arc-accent)] text-white px-5 py-2.5 text-sm font-semibold hover:brightness-110 transition"
            >
              Aller au sélecteur
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/how-to-order"
              className="inline-flex rounded-full border border-arc-divider bg-arc-surface-strong text-arc-ink px-5 py-2.5 text-sm font-semibold hover:bg-arc-surface transition"
            >
              Comment commander
            </LocalizedClientLink>
          </div>
        </div>
      </Reveal>
    </div>
  )
}
