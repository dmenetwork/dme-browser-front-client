/* eslint-disable @typescript-eslint/no-require-imports */
const builder = require("electron-builder")
const dotenv = require("dotenv")
const fs = require("fs")
const path = require("path")

// LOAD ENVIRONMENT VARIABLES
dotenv.config()

const env = {
  NODE_ENV: process.env.NODE_ENV,
  ELECTRON_MODE: process.env.ELECTRON_MODE || "build",
  GH_TOKEN: process.env.GH_TOKEN || "",
}

const envConfigFile = "env-config.js"

// ABSOLUTES ROUTES
const rootDir = process.cwd()
const envConfigPath = path.join(rootDir, envConfigFile)

// DEFINE URL REPOSITORY
let repository =
  env.NODE_ENV === "production"
    ? "dme-browser-front-client"
    : "dme-browser-front"

// CREATE A TEMP CONFIG FILE TO PASS ENV VARIABLES TO MAIN.JS
const envConfig = `
  module.exports = {
    NODE_ENV: "${env.NODE_ENV}",
    ELECTRON_MODE: "${env.ELECTRON_MODE}",
    GH_TOKEN: "${env.GH_TOKEN}",
    REPOSITORY: "${repository}",
  }
`

// CREATING env-config.js FILE
try {
  fs.writeFileSync(envConfigPath, envConfig)
  console.log(`${envConfigFile} created at: ${envConfigPath}`)
  console.log(`File exists: ${fs.existsSync(envConfigPath)}`)
} catch (error) {
  console.error(`Error creating ${envConfigFile}:`, error)
  process.exit(1)
}

// DEFINE LOGO
const logo =
  env.NODE_ENV === "production"
    ? "./public/img/dme-logo-app.png"
    : "./public/img/dme-logo-app-qa.png"
// const logo =
//   env.NODE_ENV === "production"
//     ? "./public/img/dme-logo-app.png"
//     : env.NODE_ENV === "prerelease"
//     ? "./public/img/dme-logo-app-prerelease.png"
//     : "./public/img/dme-logo-app-qa.png"

// PRODUCT NAME
const productName =
  env.NODE_ENV === "production" ? "dME Browser" : `dME Browser-${env.NODE_ENV}`

// ARTIFACT NAME
const artifactName = "${productName}-${version}.exe"

// APP ID
const appId =
  env.NODE_ENV === "production"
    ? "com.dmebrowser.app"
    : `com.dmebrowser-${env.NODE_ENV}.app`

// CONFIGURE PUBLISH GITHUB BASED ON NODE NODE_ENV
let publishConfig = {
  provider: "github",
  owner: "dmenetwork",
  repo: repository,
  private: true,
  releaseType:
    env.NODE_ENV === "production"
      ? "prerelease"
      : env.NODE_ENV === "qa"
      ? "release"
      : null,
}

// PUBLISH MODE
const publish = ["production", "qa"].includes(env.NODE_ENV) ? "always" : "never"

const config = {
  productName,
  appId,
  files: [
    "out/**/*",
    "node_modules/**/*",
    "package.json",
    "preload.js",
    "main.js",
    "splash.html",
    "!**/database/**",
    "src/**/*",
    envConfigFile,
    ".env",
  ],
  extraFiles: [
    {
      from: envConfigFile,
      to: envConfigFile,
      filter: ["**/*"],
    },
  ],
  directories: {
    buildResources: "assets",
    output: "release",
  },
  publish: publishConfig,
  releaseInfo: {
    releaseName: "Release_Name",
    releaseNotes: "Release_Notes",
    // releaseName:
    //   env.NODE_ENV === "production"
    //     ? "${productName}-${version} (production)"
    //     : "${productName}-${version} (qa)",
  },
  win: {
    icon: logo,
    asar: true,
    artifactName,
    target: {
      target: "nsis",
      arch: ["x64"],
    },
  },
  nsis: {
    allowElevation: true,
    allowToChangeInstallationDirectory: true,
    artifactName,
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    deleteAppDataOnUninstall: true,
    displayLanguageSelector: true,
    multiLanguageInstaller: true,
    oneClick: false,
    perMachine: true,
    runAfterFinish: true,
    shortcutName: productName,
    uninstallDisplayName: productName,
    removeDefaultUninstallWelcomePage: false,
  },
  mac: {
    target: {
      target: "dmg",
      arch: ["x64", "arm64"],
    },
    artifactName,
    icon: logo,
    category: "public.app-category.utilities",
  },
  linux: {
    target: "AppImage",
    icon: logo,
    artifactName,
  },
}

// Config for build
const buildOptions = {
  config,
  publish,
}

console.log("[electron-builder] repository: ", repository)
console.log("[electron-builder] env: ", env)
console.log("[electron-builder] publishConfig: ", publishConfig)
console.log("[electron-builder] publish mode:", buildOptions.publish)
console.log("[electron-builder] current working directory:", process.cwd())
console.log(
  "[electron-builder] files in directory:",
  fs.readdirSync(process.cwd())
)

builder
  .build(buildOptions)
  .then(() => {
    try {
      fs.unlinkSync(envConfigPath)
      console.log(`${envConfigFile} cleaned up successfully`)
    } catch (error) {
      console.error(`Error cleaning up ${envConfigFile}: `, error)
    }
  })
  .catch((err) => {
    console.error("Build error:", err)
    if (fs.existsSync(envConfigPath)) {
      try {
        fs.unlinkSync(envConfigPath)
      } catch (error) {
        console.error(
          `Error cleaning up ${envConfigFile} after build error: `,
          error
        )
      }
    }
    process.exit(1)
  })
