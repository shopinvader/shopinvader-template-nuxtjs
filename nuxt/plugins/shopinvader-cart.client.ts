import { ErpFetch } from '@shopinvader/fetch'
import {
  AddressService,
  DeliveryCarrierService,
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

  services?.auth.onUserLoaded(() => {
    const services = shopinvader?.services
    const erp = providers?.erp as ErpFetch
    if (erp) {
      /** Settings */
      const settings = services.settings || new SettingService(erp)
      settings.init()
      services.settings = settings

      /** Sales */
      services.sales = services.sales || new SaleService(erp)

      /** Address */
      services.addresses = services.addresses || new AddressService(erp)

      /** Delivery Carrier */
      services.deliveryCarriers =
        services.deliveryCarriers || new DeliveryCarrierService(erp)
    }
  })

  services?.auth.onUserUnloaded(() => {
    shopinvader.services = {
      ...shopinvader.services,
      ...{
        sales: null,
        cart: null,
        addresses: null,
        deliveryCarriers: null
      }
    }
  })
})
