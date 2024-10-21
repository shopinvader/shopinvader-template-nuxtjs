# Nuxt ShopInvader Demonstration template

[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

shopinvader-template-nuxtjs is a Nuxt 3 VueJS open-source template for ShopInvader the
e-commerce solution for Odoo.

See [shopinvader.com](https://shopinvader.com)
Look at the [nuxt 3 documentation](https://v3.nuxtjs.org) to learn more.

## About

This template provides a solid and flexible foundation for building a new
ShopInvader webshop. You can extend and adapt this theme to meet your webshop requirements.

## Setup

Clone this repository

```bash
$ git clone https://github.com/shopinvader/shopinvader-template-nuxtjs.git YOUR_SITE_NAME
```

Make sure to install the dependencies:

```bash
# yarn
yarn install

```

Node version >= 18 is required.
You can use NVM to manage your node versions.

```bash
nvm use
or
nvm install 18
nvm use 18

```
## Development Server

Start the development server on http://localhost:3000

```bash
yarn dev
```

## Production

Build the application for production:

```bash
yarn build
```

Locally preview production build:

```bash
yarn preview
```
Checkout the [deployment documentation](https://v3.nuxtjs.org/guide/deploy/presets) for more information.

## Add App Basic Auth

You can add basic auth to your app by adding the following environment variables:

```bash
NUXT_BASIC_AUTH="user1:pass1;user2:pass2"
```

## Shopinvader Services

You can access to the Shopinvader API (Odoo) or Product and category data (Elasticsearch) via a list of TS services.
A service is a class that provides a set of methods to interact with the API.

These services are included in the template (./service directory) you can access to all the services via a composable function.

via the plugin:

```ts
const cartService = useShopinvaderService('cart')
const cart = await cartService.getCart()

const productService = useShopinvaderService('products')
const products = await productService.getAll()
```

### Add a new service

You can extend the service list by adding a new service in the ./service directory.
To load the service you need to add it in the global interface ShopinvaderServiceList
and add in the Nuxt context plugin.
After loading the service you can access to it via the composable function useShopinvaderService.

```ts
/** ./services/MyCustomService.ts */
// New service class
export class MyCustomService {
  i: Ref<number>
  constructor() {
    this.i = useState('i', () => 0)
  }
  up() {
    this.i.value++
  }
  public get() {
    return this.i
  }
}

/** ./plugins/CustomServices.ts */
// Add the service in the global interface
declare global {
  interface ShopinvaderServiceList {
    ['myCustomService']: MyCustomService
  }
}

// Add the service in the Nuxt context plugin
export default defineNuxtPlugin((nuxtApp) => {
  const services = nuxtApp.$shopinvader.services as ShopinvaderServiceList
  services.myCustomService = new MyCustomService()
})

/** ./pages/index.ts */
// Use the service in a page
<script setup lang="ts">
  const service = useShopinvaderService('myCustomService')
  const i = service.get()
  const up = () => service.up()
</script>
```


## Using the ShopInvader template as a Nuxt Layer

This section describes how to create a new Nuxt ShopInvader application from scratch, using the ShopInvader template as a Nuxt Layer.

### Create a new Nuxt project

Create a new Nuxt project with Nuxi: 
```bash
npx nuxi@latest init <project-dir>
```

Answer the questions:
- Install Nuxi? => Y
- Which package manager? => npm

### Add ShopInvader template to the project

Add the ShopInvader template as a git submodule to the project:

```bash
git submodule add https://github.com/shopinvader/shopinvader-template-nuxtjs shopinvader-template-nuxtjs
```

Then add the ShopInvader template as a Nuxt Layer to the Nuxt application by adding the following line in the nuxt.config.ts file:
```ts
extends: ['./shopinvader-template-nuxtjs'],
```

Install all packages requested by the ShopInvader template:
```bash
npm i -D ts-morph 
npm i -D sass-embedded
npm i -D daisyui@latest
npm i pinia -f
npm i pinia-plugin-persistedstate
npm i @pinia-plugin-persistedstate/nuxt
npm i @nuxtjs/critters
npm i nuxt-storage
npm i elastic-builder
npm i oidc-client-ts
npm i @vueuse/motion
npm i @vueform/slider
npm i @shopinvader/cart@https://github.com/shopinvader/shopinvader-js-cart.git#options
```

Install all Nuxt modules requested by the ShopInvader template, using Nuxt CLI (Nuxi):
```bash
npx nuxi@latest module add eslint
npx nuxi@latest module add pinia
npx nuxi@latest module add content
npx nuxi@latest module add i18n
npx nuxi@latest module add icon
npx nuxi@latest module add image
npx nuxi@latest module add fonts
npx nuxi@latest module add seo
npx nuxi@latest module add delay-hydration
npx nuxi@latest module add tailwindcss
```

The ShopInvader template requests that you provide an `assets/css/main.css` file. So, add this file to your project.

The ShopInvader template needs to be "build" at least once to generate the necessary files. In the `package.json` file, replace the "postinstall" command with this: `"nuxt prepare shopinvader-template-nuxtjs && nuxt prepare"`
Then launch the following command to postinstall the ShopInvader template:
```bash
npm install
```

Replace the default `/app.vue` file with the `/shopinvader-template-nuxtjs/app.vue` file to get rid of the default Nuxt layout.

### Localize the application

Add locales config in nuxt.config.ts:
```ts
  i18n: {
    locales: [
      {
        code: "fr",
        name: "FR",
        language: "fr_be",
        file: "fr.json",
        icon: "circle-flags:fr",
      }
    ],
    strategy: "prefix",
    lazy: false,
    langDir: "./locales/",
  },
```

Create a file named `/locales/fr.json`.

### Add ShopInvader configuration

Create a `.env` file with the following content (adapt the values to your needs):
```bash
# ERP URL. If the value is '/shopinvader' then calls to the erp go through the proxy (see NUXT_SHOPINVADER_ERP_PROXY_URL) else directly to the full url given here.
NUXT_PUBLIC_SHOPINVADER_ERP_URL="/shopinvader"
# Elastic root URL of the ElasticSearch server.
NUXT_PUBLIC_SHOPINVADER_ELASTICSEARCH_URL="https://elastic.domain.com"
# Elastic indexes. They will automatically be localized: categories_fr_be, products_fr_be, etc.
NUXT_PUBLIC_SHOPINVADER_ELASTICSEARCH_INDICES_CATEGORIES="categories"
NUXT_PUBLIC_SHOPINVADER_ELASTICSEARCH_INDICES_PRODUCTS="products"
# Auth server URL
NUXT_PUBLIC_SHOPINVADER_AUTH_PROFILE_AUTHORITY="https://keycloak.domain.com/realms/name"
# Erp Proxy. The URL that the proxy will use to call the erp.
NUXT_SHOPINVADER_ERP_PROXY_URL="https://erp.domain.com/shopinvader" 
# Erp Proxy logging level: 0=off, 1=info, 2=debug
NUXT_SHOPINVADER_ERP_PROXY_LOGLEVEL=1
# NOTE: if you change something in this file then you need to relaunch nuxt.
```

Launch the project:
```bash
npm run dev
```

Note: if you see the following error/warning, "The legacy JS API is deprecated and will be removed in Dart Sass 2.0.0" warning, then add this in nuxt.config.ts:
```ts
  vite: {
    // The default API when using Vite is currently set to legacy, change it to modern.
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern",
        },
      },
    },
  },
  ```

### Cutomize the application

You can now customize the application to your needs. Add new pages, components, services, etc.

## License

This project is open source under the terms of the [MIT License](./LICENSE)

<!-- Badges -->

[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?&logo=nuxt.js
[nuxt-href]: https://nuxt.com
[license-src]: https://img.shields.io/github/license/nuxt-themes/docus.svg?style=flat&colorA=002438&colorB=28CF8D
[license-href]: https://github.com/nuxt-themes/docus/blob/main/LICENSE



