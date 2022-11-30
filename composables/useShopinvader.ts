import { Shopinvader, ShopinvaderServiceList } from '@shopinvader/services'
export const useShopinvader = (): Shopinvader => {
    const nuxtApp = useNuxtApp()
    return nuxtApp.$shopinvader as Shopinvader
}
export const useShopinvaderServices = (): ShopinvaderServiceList => {
    const nuxtApp = useNuxtApp()
    return nuxtApp.$shopinvader.services as ShopinvaderServiceList
}