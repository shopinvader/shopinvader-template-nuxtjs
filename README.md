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

## License

This project is open source under the terms of the [MIT License](./LICENSE)

<!-- Badges -->

[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?&logo=nuxt.js
[nuxt-href]: https://nuxt.com
[license-src]: https://img.shields.io/github/license/nuxt-themes/docus.svg?style=flat&colorA=002438&colorB=28CF8D
[license-href]: https://github.com/nuxt-themes/docus/blob/main/LICENSE
