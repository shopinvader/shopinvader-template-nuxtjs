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
  services: Service[] = []
  setServices(services: Service[]) {
    this.services = services || []
  }
  getService(name: string): Service {
    for(const service of this.services) {
      if(service.serviceName == name) {
        return service
      }
    }
    return this?.services?.find() || null
  }
  store() {
    return useShopinvaderStore()
  }
}
