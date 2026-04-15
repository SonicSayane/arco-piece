import { defineWidgetConfig } from "@medusajs/admin-sdk"

const LoginBrandingWidget = () => {
  return (
    <>
      <style>
        {`
          div[class*="max-w-[280px]"] > div:first-child,
          div[class*="max-w-[280px]"] > div:nth-child(2) {
            display: none !important;
          }
        `}
      </style>
      <div className="mb-4 flex flex-col items-center gap-y-2">
        <img
          src="/static/arco-piece-svg.svg"
          alt="Arco-Piece"
          className="h-12 w-12 rounded-lg object-contain"
        />
        <h1 className="text-ui-fg-base txt-large-plus font-semibold">
          Administration Arco-Piece
        </h1>
        <p className="text-ui-fg-subtle txt-small text-center">
          Connectez-vous pour acceder a votre espace d'administration.
        </p>
      </div>
    </>
  )
}

export const config = defineWidgetConfig({
  zone: "login.before",
})

export default LoginBrandingWidget
