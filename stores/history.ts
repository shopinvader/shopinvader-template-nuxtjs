import { defineStore } from 'pinia'
import { Product } from '~/models'

export const useHistoryStore = defineStore('history', {
  state: () => ({ queries: [] as string[], products: [] as Product[] }),

  persist: {
    storage: persistedState.localStorage,
    afterRestore(ctx) {
      const data = ctx?.store?.products || null
      if(data) {
        ctx.store.products = data.map((p: any) => new Product(p))
      }
    },
  },
  getters: {
    getQueries(): string[] {
      return this.queries
    },
    getProducts(): Product[] {
      return this.products
    }
  },
  actions: {
    addProduct(product: Product) {
      const index = this.products.findIndex((p) => p.id === product.id)
      if (index > -1) {
        this.products.splice(index, 1)
      }
      this.products.unshift(product)
      this.products = this.products.slice(0, 5)
    },
    removeProduct(product: Product) {
      const index = this.products.findIndex((p) => p.id === product.id)
      if (index > -1) {
        this.products.splice(index, 1)
      }
    },
    addQuery(query: string) {
      query = query.trim().toLocaleLowerCase()
      if (query && query.length > 3 && !this.queries.includes(query)) {
        this.queries.push(query)
        this.queries = this.queries.slice(0, 5)
      }
    },
    removeQuery(query: string) {
      const index = this.queries.indexOf(query)
      if (index > -1) {
        this.queries.splice(index, 1)
      }
    },
    removeAllQuery() {
      this.queries = []
    },
    removeAllProducts() {
      this.products = []
    }
  }
})
