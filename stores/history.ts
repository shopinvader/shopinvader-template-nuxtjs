import { defineStore } from 'pinia'
import { type Category, Product } from '#models'

interface ScrollHistory {
  url: string
  y: number
}
// Store history on queries, products and the last category
export const useHistoryStore = defineStore('history', {
  state: () => ({
    queries: [] as string[],
    products: [] as Product[],
    lastCategory: null as Category | null,
    lastSearchScroll: null as ScrollHistory | null
  }),

  persist: {
    storage: persistedState.localStorage,
    serializer: {
      deserialize: (data: string)=> {
        const pasedData: any = JSON.parse(data)
        if(pasedData?.products){
          pasedData.products = pasedData.products.map((p: any) => new Product(p))
        }
        return pasedData
      },
    }
   
  },
  getters: {
    getQueries(): string[] {
      return this.queries
    },
    getProducts(): Product[] {
      return this.products
    },
    getLastCategory(): Category | null {
      return this.lastCategory || null
    }
  },
  actions: {
    setLastCategory(category: Category) {
      this.lastCategory = category
    },
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
