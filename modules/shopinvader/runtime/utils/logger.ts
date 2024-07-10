import { useLogger } from '@nuxt/kit'
export const useShopinvaderLogger = () => {
  return useLogger('Shopinvader', {
    level: 4
  })
}
