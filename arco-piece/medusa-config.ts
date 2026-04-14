import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  admin: {
    path: "/app",
    vite: (config) => {
      const placeholderTag = '<link rel="icon" href="data:," data-placeholder-favicon />'
      const faviconTag = '<link rel="icon" type="image/svg+xml" href="/static/arco-piece-svg.svg" />'

      const injectedPlugin = {
        name: "arco-admin-favicon",
        transformIndexHtml: (html: string) => {
          if (html.includes(placeholderTag)) {
            return html.replace(placeholderTag, faviconTag)
          }

          if (html.includes("</head>")) {
            return html.replace("</head>", `  ${faviconTag}\n</head>`)
          }

          return `${faviconTag}\n${html}`
        },
      }

      return {
        ...config,
        plugins: [...(config.plugins ?? []), injectedPlugin],
      }
    },
  },
  modules: [
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/payment-stripe",
            id: "stripe",
            options: {
              apiKey: process.env.STRIPE_API_KEY,
              webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
            },
          },
        ],
      },
    },
  ],
})
