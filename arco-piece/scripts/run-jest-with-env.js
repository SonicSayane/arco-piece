const fs = require("fs")
const path = require("path")
const { spawnSync } = require("child_process")

const ENV_FILES = [".env", ".env.test"]
const DEFAULT_NODE_OPTIONS = "--experimental-vm-modules"

const stripQuotes = (value) => {
  if (!value) {
    return value
  }

  const startsWithQuote = value.startsWith('"') || value.startsWith("'")
  const endsWithQuote = value.endsWith('"') || value.endsWith("'")

  if (startsWithQuote && endsWithQuote) {
    return value.slice(1, -1)
  }

  return value
}

const parseEnvFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    return {}
  }

  const content = fs.readFileSync(filePath, "utf8")

  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"))
    .reduce((acc, line) => {
      const separatorIndex = line.indexOf("=")

      if (separatorIndex <= 0) {
        return acc
      }

      const key = line.slice(0, separatorIndex).trim()
      const value = stripQuotes(line.slice(separatorIndex + 1).trim())

      acc[key] = value
      return acc
    }, {})
}

const mergeNonEmpty = (target, source) => {
  const next = { ...target }

  for (const [key, value] of Object.entries(source)) {
    if (value !== "") {
      next[key] = value
    }
  }

  return next
}

const applyDbVarsFromUrl = (env) => {
  if (!env.DATABASE_URL) {
    return env
  }

  try {
    const databaseUrl = new URL(env.DATABASE_URL)
    const nextEnv = { ...env }

    if (!nextEnv.DB_HOST && databaseUrl.hostname) {
      nextEnv.DB_HOST = databaseUrl.hostname
    }

    if (!nextEnv.DB_PORT && databaseUrl.port) {
      nextEnv.DB_PORT = databaseUrl.port
    }

    if (!nextEnv.DB_USERNAME && databaseUrl.username) {
      nextEnv.DB_USERNAME = decodeURIComponent(databaseUrl.username)
    }

    if (!nextEnv.DB_PASSWORD && databaseUrl.password) {
      nextEnv.DB_PASSWORD = decodeURIComponent(databaseUrl.password)
    }

    if (!nextEnv.DB_NAME && databaseUrl.pathname.length > 1) {
      nextEnv.DB_NAME = decodeURIComponent(databaseUrl.pathname.slice(1))
    }

    return nextEnv
  } catch (error) {
    return env
  }
}

const testType = process.argv[2]
const jestArgs = process.argv.slice(3)

if (!testType) {
  console.error("Missing TEST_TYPE argument (expected: unit, integration:http, integration:modules).")
  process.exit(1)
}

const fileEnv = ENV_FILES.reduce((acc, envFileName) => {
  const absolutePath = path.join(process.cwd(), envFileName)
  return mergeNonEmpty(acc, parseEnvFile(absolutePath))
}, {})

let executionEnv = {
  ...fileEnv,
  ...process.env,
}

executionEnv = applyDbVarsFromUrl(executionEnv)

executionEnv.TEST_TYPE = testType
executionEnv.NODE_OPTIONS = executionEnv.NODE_OPTIONS || DEFAULT_NODE_OPTIONS

if (testType.startsWith("integration")) {
  const missing = ["DB_HOST", "DB_PORT", "DB_USERNAME", "DB_PASSWORD"].filter(
    (key) => !executionEnv[key]
  )

  if (missing.length) {
    console.error(
      `Missing test database variables: ${missing.join(", ")}. Set them in .env.test or provide DATABASE_URL with credentials.`
    )
    process.exit(1)
  }
}

const jestBinPath = path.join(process.cwd(), "node_modules", "jest", "bin", "jest.js")

const jestResult = spawnSync(process.execPath, [jestBinPath, ...jestArgs], {
  env: executionEnv,
  stdio: "inherit",
})

if (jestResult.error) {
  console.error(jestResult.error.message)
  process.exit(1)
}

process.exit(jestResult.status ?? 1)