import {
  AddressService,
  CartService,
  SettingService,
  SaleService
} from '../services'
import { Shopinvader } from './shopinvader'

export default defineNuxtPlugin((nuxtApp) => {
  const shopinvader: Shopinvader = nuxtApp?.$shopinvader as Shopinvader
  const { providers, services } = shopinvader
  if (!providers || !services || !services?.auth) {
    return null
  }
  services?.auth.me()
  services?.auth.onUserLoaded(() => {
    let settings,
      cart,
      sales,
      addresses = null
    if (shopinvader?.services?.settings === null) {
      if (providers?.erp != undefined) {
        settings = new SettingService(providers.erp)
        settings.init()
      }
    }
    if (shopinvader?.services?.sales === null) {
      if (providers?.erp != undefined) {
        sales = new SaleService(providers.erp)
      }
    }
    if (shopinvader?.services?.cart === null) {
      if (providers?.erp != undefined || services?.products !== undefined) {
        cart = new CartService(providers?.erp, services?.products)
      }
    }
    if (shopinvader?.services?.addresses === null) {
      if (providers?.erp != undefined) {
        addresses = new AddressService(providers?.erp, settings?.options)
      }
    }
    shopinvader.services = {
      ...shopinvader.services,
      ...{
        settings,
        sales,
        cart,
        addresses
      }
    }
  })

  services?.auth.onUserUnloaded(() => {
    shopinvader.services = {
      ...shopinvader.services,
      ...{
        sales: null,
        cart: null,
        addresses: null
      }
    }
  })
})
