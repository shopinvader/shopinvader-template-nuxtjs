import { defineStore } from 'pinia'
import { User, Cart } from '../models'
export const useShopinvaderStore = defineStore('shopinvader', {
  // a function that returns a fresh state

  state: () => ({
    user: null as User | boolean | null,

    lastSale: {},
    cart: new Cart({})
  }),
  getters: {
    getCurrentRole(store) {
      if(!store?.user) {
        return 'default'
      }
      return store?.user?.role as string || 'default'
    }
  },
  actions: {
    setLastSale(sale: any) {
      this.lastSale = sale
    },
    setUser(data: User | null) {
      this.user = data == null ? false : data
    },
    setCart(cart: Cart | null) {
      this.cart = cart || new Cart({})
    }
  }
})

export class Service {
  serviceName: string = 'Service'
  services: ShopinvaderServiceList | null = null
  init(services: ShopinvaderServiceList) {
    this.services = services
  }
  store() {
    return useShopinvaderStore()
  }
}
