import { Metadata } from "next"

import LoginTemplate from "@modules/account/templates/login-template"

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connectez-vous a votre compte Arco-Piece.",
}

export default function Login() {
  return <LoginTemplate />
}
