import { defineStore } from 'pinia'
import { User, Cart } from '~/models'
export const useShopinvaderStore = defineStore('shopinvader', {
  // a function that returns a fresh state

  state: () => ({
    user: null as User | null,
    lastSale: {},
    cart: new Cart({})
  }),
  getters: {},
  actions: {
    setUser(data: User | null) {
      this.user = data
    },
    setCart(cart: Cart | null) {
      this.cart = cart || new Cart({})
    }
  }
})

export class Service {
  store() {
    return useShopinvaderStore()
  }
}
