import { AddressService, CartService, SettingService } from '../services'
import consola from 'consola'

export default defineNuxtPlugin((nuxtApp) => {
  const auth = nuxtApp?.$auth
  const shopinvader = nuxtApp?.$shopinvader
  const { providers, services } = shopinvader

  auth.onUserLoaded(() => {
    let settings, cart, address = null
    if(shopinvader?.services?.settings === null) {
      consola.log('init settings')
      if (providers?.erp != undefined) {
        settings = new SettingService(providers.erp)
        settings.init()
      }
    }
    if (shopinvader?.services?.cart === null) {
      consola.log('init cart')
      if (providers?.erp != undefined || services?.products !== undefined) {
        cart = new CartService(providers?.erp, services?.products)
      }
    }
    if (shopinvader?.services?.address === null) {
      consola.log('init address')
      if (providers?.erp != undefined) {
        address = new AddressService(providers?.erp, settings?.options)
      }
    }
    shopinvader.services = {
      ...shopinvader.services,
      ...{
        settings,
        cart,
        address
      }
    }
  })

})
