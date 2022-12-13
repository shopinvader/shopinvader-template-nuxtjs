import { CartService } from '../services'
import consola from 'consola'

export default defineNuxtPlugin((nuxtApp) => {
  const shopinvader = nuxtApp?.$shopinvader
  if (shopinvader?.services?.cart === null) {
    const { providers, services } = shopinvader
    consola.log(providers)
    if (providers?.erp != undefined || services?.products !== undefined) {
      shopinvader.services.cart = new CartService(providers?.erp, services?.products)
    }
  }
})
