import { Cart, CartTransaction, WebStorageCartStorage } from '@shopinvader/cart'
import { Cart as CartModel, Product, CartLine as CartLineModel } from '~/models'
import { ProductService } from './ProductService'
import { createPinia, defineStore } from 'pinia'

interface CartStore {
  cart: CartModel
  lastSale: any
  loaded: boolean
  hasPendingTransactions: boolean
  hasSyncError: boolean
  syncError: boolean
  syncing: boolean
}

class CartObserver {
  callback: Function // Nuxt context
  constructor(callback: Function) {
    this.callback = callback
  }

  onCartUpdated(data: any) {
    const cartData = { ...data.getData() }

    const erpCart = cartData?.erpCart || {}
    const syncError = cartData?.syncError || false
    const cart = new CartModel(erpCart)
    if (Array.isArray(cartData?.lines)) {
      const cartLines = []
      for (const line of cartData.lines) {
        const { hasPendingTransactions, qty, productId } = line

        const lineData = {
          ...line.erpCartLine,
          ...{
            id: line?.erpCartLine?.id,
            qty,
            product_id: productId,
            hasPendingTransactions
          }
        }
        const cartLine = new CartLineModel(lineData)
        cartLines.push(cartLine)
      }
      CartModel.setLines(cart, cartLines)
    }
    this.callback(cart, syncError)
  }
}


export class CartService {
  erp: any // ErpFetch
  cart: any | null
  id: number | null // Cart ID
  store: any
  products: Product[] = []
  productService: ProductService = null
  constructor(erp: any, productService: ProductService) {
    this.erp = erp
    this.productService = productService
    const { vueApp } = useNuxtApp()
    const pinia = usePinia()
    let productStore: Product[] = []
    this.store = defineStore('shopinvader', {
      state: () => (
        {
          lastSale: {},
          cart: new CartModel({}),
        } as CartStore
      ),

      actions: {
        setSyncError(data: boolean) {
          this.cart.hasSyncError = data
        },
        setSyncing(data: boolean) {
          this.cart.syncing = data
        },
        setHasPendingTransactions(status: boolean) {
          this.cart.hasPendingTransactions = status
        },
        async setCart(data: CartModel) {
          if (productService !== null) {
            const ids = data.lines.map((l: CartLineModel) => l.productId).filter((i: number) => !productStore.some(p => i === p?.id)) || []
            if (ids.length > 0) {
              const products = await productService.getByIds(ids) || []
              if (Array.isArray(products?.hits)) {
                productStore = [...productStore, ...products.hits]
              }
            }

            for (const line of (data?.lines || [])) {
              const product = productStore.find((p: Product) => p.id === line.productId) || null
              if (product !== null) {
                line.product = product
              }
            }
          }

          this.cart = data
          let unSyncLine: boolean = false
          if (Array.isArray(data?.lines)) {
            unSyncLine = data.lines.some((i: CartLineModel) => {
              return i.hasPendingTransactions === true
            }) || false
          }
          this.cart.hasPendingTransactions = unSyncLine
          this.cart.loaded = true
        },
        setLastSale(data) {
          this.lastSale = data
        },
        resetCart() {
          this.cart = new CartModel({})
        }
      },
    })
    const observer = new CartObserver((cart) => {
      this.store().setCart(cart)
    })
    this.cart = new Cart(this.erp, new WebStorageCartStorage(window.localStorage))
    this.cart.registerObserver(observer)
    const cartData = this.cart.getData()
  }
  addProduct(product: Product, qty: number = 1) {
    this.cart.addTransaction(new CartTransaction(product?.id, qty));
  }
}
