# dME Browser Front

Desktop browser app for companies.

Built on Electron JS and Chromium

## URLs

> **QA Latest Version:** https://github.com/dmenetwork/dme-browser-front/releases/latest

> **PROD Latest Version:** https://github.com/dmenetwork/dme-browser-front-client/releases/latest

## Prerequisites

Ensure you have the following installed before initializing the project:

- **node** >=20.17.0 <21.0.0
- **npm** >=10.0.0 <11.0.0
- **Yarn** >= 1.22.22

## Features & Dependencies

- **Electron JS v32**
- **Next JS v14**
- **React JS v18**
- **TypeScript**
- **React Redux**
- **Material UI v6** (Component UI)
- **SQLite** (Local Database)
- **Express** (Local Node Server)
- **Axios** (Fetch data)
- **Crypto JS** (Hash & Encrypt)
- **Lucide React** (Icons)
- **Moment Timezone** (Dates)
- **Pusher JS** (Realtime Communication - Web Socket)
- **uuid** (Unique ID)

## Local Environment
To setup your local environment you have the following the next steps:

### .env.local
Create in the root folder a **.env** file.

```bash
NEXT_PUBLIC_ENV=development
NODE_ENV=development
ELECTRON_MODE=build
```

**NEXT_PUBLIC_ENV** define the environment for Next JS app
**NODE_ENV** define the environment for Electron JS app
**ELECTRON_MODE** define the type of deploy of Electron. This can be **build** or **start**

When **ELECTRON_MODE** is **start**, the app will start locally running Next JS on **dev mode** and Electron loading **Next Local Url** (ex. localhost:3000)

When **ELECTRON_MODE** is **build**, the app will start building the entire Electron and Next apps. For this mode, the app will run with Electron using Express to serve the exported Static Next App.


### Install dependency
For dependencies just run

```bash
yarn 
```

### Run App locally
For run this app locally, we have some custom scripts, so just run

```bash
yarn dev
```

## Creating a Local DEV installer

To create a locally dev installer, run 

```bash
yarn build
```

This will create a dev installer on the *release* folder called *dME Browser - dev-1.1.10.exe* for example


## Creating a QA installer

<img src="https://res.cloudinary.com/dsjhf7sm3/image/upload/v1731933118/dME/dme-logo-qa.png" alt="Alt text" width="100">

To create a installer for QA, we already have a Github Actions to build, deploy and distribute the app.

Upload the code to **qa** branch. This trigger the GH Actions

When build and deploy is ready, a **push notification** will be send to **Product/DevOps** Teams Channel and the app will be automatically update to the last RELEASE QA version 

> **QA Latest Version:** https://github.com/dmenetwork/dme-browser-front/releases/latest

## Creating a PRODUCTION installer

<img src="https://res.cloudinary.com/dsjhf7sm3/image/upload/v1731933199/dME/dme-logo-app.png" alt="Alt text" width="100">

To create a installer for PRODUCTION, we already have a Github Actions to build, deploy and distribute the app, but you need to do an aditional step.

Upload the code to **master** branch. This trigger the GH Actions

When build and deploy is ready, a **push notification** will be send to **Product/DevOps** Teams Channel.

For this time, the app will be "sent" to another repository

> https://github.com/dmenetwork/dme-browser-front-client

**This Repo is ONLY FOR PRODUCCTION DEPLOY AND DISTRIBUTE!**

In this repo, the current version will be define as **"PRE RELEASE"** version. 

**ONLY WHEN THE APP CHANGE TO "RELESASE" WILL BE DISTRIBUTE FOR END USERS
