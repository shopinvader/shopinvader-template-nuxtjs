import { defineStore } from 'pinia'
import type { User } from '../models'
import { Cart } from '../models'

export const useShopinvaderStore = defineStore('shopinvader', {
  // a function that returns a fresh state
  state: () => ({
    user: null as User | null,

    lastSale: {},
    cart: new Cart({})
  }),
  getters: {
    getCurrentRole(store) {
      if (!store?.user) {
        return 'default'
      }
      return (store?.user?.role as string) || 'default'
    }
  },
  actions: {
    setLastSale(sale: any) {
      this.lastSale = sale
    },
    setUser(data: User | null) {
      this.user = data == null ? null : data
    },
    setCart(cart: Cart | null) {
      this.cart = cart || new Cart({})
    }
  }
})

export class Service {
  // List of all available services
  services: ShopinvaderServiceList | null = null

  // Init is called after custom ShopInvader was allowed to replace or
  // add services in the global list of services. Use this method to
  // initialize all stuff you need to use in your service.
  init(services: ShopinvaderServiceList) {
    this.services = services
  }

  store() {
    return useShopinvaderStore()
  }
}
