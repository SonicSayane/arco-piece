export type Dict = {
  nav: {
    home: string
    catalog: string
    cart: string
    account: string
    searchPlaceholder: string
    searchAll: string
    searchEmpty: string
  }
  trust: {
    payment: { title: string; description: string }
    shipping: { title: string; description: string }
    support: { title: string; description: string }
    compatibility: { title: string; description: string }
  }
  emptyCart: {
    title: string
    description: string
    cta: string
  }
  notFound: {
    title: string
    description: string
    home: string
    catalog: string
  }
}

const dict: Dict = {
  nav: {
    home: "Accueil",
    catalog: "Catalogue",
    cart: "Panier",
    account: "Compte",
    searchPlaceholder: "Rechercher une pièce, une référence OEM…",
    searchAll: "Voir tous les résultats →",
    searchEmpty: "Aucun résultat pour",
  },
  trust: {
    payment: {
      title: "Paiement sécurisé",
      description: "Stripe — Visa, Mastercard, Mobile Money",
    },
    shipping: {
      title: "Livraison UEMOA",
      description: "Couverture des 8 pays + international",
    },
    support: {
      title: "Support en français",
      description: "Notre équipe répond en moins de 24h",
    },
    compatibility: {
      title: "Pièces compatibles",
      description: "Recherche par marque, modèle, année",
    },
  },
  emptyCart: {
    title: "Votre panier est vide",
    description:
      "Aucun article pour le moment. Parcourez le catalogue pour trouver les pièces qu'il vous faut.",
    cta: "Explorer le catalogue",
  },
  notFound: {
    title: "Cette page roule en panne",
    description:
      "La page que vous cherchez n'existe pas ou a été déplacée. Reprenez la route depuis l'accueil ou explorez le catalogue.",
    home: "Retour à l'accueil",
    catalog: "Voir le catalogue",
  },
}

export default dict
