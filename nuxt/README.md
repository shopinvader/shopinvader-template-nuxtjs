# Nuxt ShopInvader Demonstration template

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

## License

This project is open source under the terms of the [MIT License](./LICENSE)

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
