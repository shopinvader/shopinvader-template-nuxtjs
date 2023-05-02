import { defineStore } from 'pinia'
import { User } from '~/models'
export const useShopinvaderStore = defineStore('shopinvader', {
  // a function that returns a fresh state
  state: () => ({
    user: null as User | null
  }),
  getters: {},
  actions: {
    setUser(data: User | null) {
      this.user = data
    }
  }
})

export class Service {
  store() {
    return useShopinvaderStore()
  }
}
