import type { Dict } from "./fr"

const dict: Dict = {
  nav: {
    home: "Home",
    catalog: "Catalog",
    cart: "Cart",
    account: "Account",
    searchPlaceholder: "Search for a part, an OEM reference…",
    searchAll: "See all results →",
    searchEmpty: "No results for",
  },
  trust: {
    payment: {
      title: "Secure payment",
      description: "Stripe — Visa, Mastercard, Mobile Money",
    },
    shipping: {
      title: "UEMOA shipping",
      description: "Coverage across the 8 countries + international",
    },
    support: { title: "Support in French", description: "Our team replies within 24h" },
    compatibility: {
      title: "Compatible parts",
      description: "Search by make, model, year",
    },
  },
  emptyCart: {
    title: "Your cart is empty",
    description:
      "No items yet. Browse the catalog to find the parts you need.",
    cta: "Browse the catalog",
  },
  notFound: {
    title: "This page broke down",
    description:
      "The page you're looking for doesn't exist or has been moved. Head back home or explore the catalog.",
    home: "Back to home",
    catalog: "Browse catalog",
  },
}

export default dict
