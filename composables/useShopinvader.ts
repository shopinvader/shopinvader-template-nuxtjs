import { useNuxtApp } from '#app'
import { Cart } from '~~/models'
import { Shopinvader, ShopinvaderServiceList } from '~~/plugins/shopinvader'

export const useShopinvader = (): Shopinvader => {
  return useNuxtApp().$shopinvader
}

export const useShopinvaderServices = (): ShopinvaderServiceList | null => {
  const { services } = useShopinvader()
  return services || null
}

export const useCart = (): Cart | null => {
  const { services } = useShopinvader()
  return services?.cart?.store()?.cart || null
}