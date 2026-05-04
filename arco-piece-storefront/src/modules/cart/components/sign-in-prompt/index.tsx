import { Heading, Text } from "@medusajs/ui"
import ArcButton from "@modules/common/components/arc-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SignInPrompt = () => {
  return (
    <div className="flex flex-col small:flex-row small:items-center justify-between gap-3">
      <div>
        <Heading level="h2" className="font-display text-lg text-arc-ink">
          Vous avez déjà un compte ?
        </Heading>
        <Text className="text-sm text-arc-muted mt-1">
          Connectez-vous pour retrouver vos commandes et adresses.
        </Text>
      </div>
      <LocalizedClientLink href="/account">
        <ArcButton variant="secondary" data-testid="sign-in-button">
          Se connecter
        </ArcButton>
      </LocalizedClientLink>
    </div>
  )
}

export default SignInPrompt
