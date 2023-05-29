import { Cart, CartTransaction, WebStorageCartStorage } from '@shopinvader/cart'
import { Cart as CartModel, Product, CartLine as CartLineModel } from '~/models'
import { ProductService } from './ProductService'
import { storeToRefs } from 'pinia'
import { Service } from './Service'

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
  callback: (cart: CartModel, syncError: boolean) => void // Nuxt context
  constructor(callback: (cart: CartModel, syncError: boolean) => void) {
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

export class CartService extends Service {
  erp: any // ErpFetch
  cart: any | null
  id: number | null = null // Cart ID
  products: Product[] = []
  productService: ProductService | null = null
  constructor(erp: any, productService: ProductService) {
    super()
    this.erp = erp
    this.productService = productService
    this.setCart = this.setCart.bind(this)

    if (process.client) {
      const observer = new CartObserver(this.setCart)
      this.cart = new Cart(
        this.erp,
        new WebStorageCartStorage(window.localStorage)
      )
      this.cart.registerObserver(observer)
      this.cart.syncWithRetry()
    }
  }
  getCart(): Ref<CartModel | null> {
    const store = this.store()
    const { cart } = storeToRefs(store)
    return cart || null
  }

  async setCart(cart: CartModel | null) {
    const store = this.store()
    if (cart == null) {
      store.setCart(null)
      return
    }
    /** Fetch cart product to product index */
    if (this.productService !== null) {
      const ids: number[] =
        cart.lines
          .map((l: CartLineModel) => l.productId || 0)
          .filter(
            (i: number | null) =>
              i !== null && !this.products.some((p) => i === p?.id)
          ) || []

      if (ids.length > 0) {
        const products = (await this.productService.getByIds(ids)) || []
        if (Array.isArray(products?.hits)) {
          this.products = [...this.products, ...products.hits]
        }
      }

      for (const line of cart?.lines || []) {
        const product =
          this.products.find((p: Product) => p.id === line.productId) || null

        if (product !== null) {
          line.product = product
        }
      }
    }
    cart.hasPendingTransactions =
      cart?.lines?.some((i: CartLineModel) => {
        return i.hasPendingTransactions === true
      }) || false
    cart.loaded = true

    store.setCart(cart)
  }

  addTransaction(id: number, qty: number) {
    if (id != null && qty != null && !isNaN(qty)) {
      this.cart.addTransaction(new CartTransaction(id, qty))
    }
  }

  applyDeltaOnItem(productId: number, delta: number) {
    this.addTransaction(productId, delta)
  }

  /**
   * addItem : add an item to cart
   * @param {*} id product Id
   * @param {*} options Options
   * @returns Promise
   */
  addItem(productId: number, qty: number) {
    this.addTransaction(productId, qty || 1)
  }

  /**
   * updateItem : update a cart line
   * @param {*} productId product Id
   * @param {*} options Options
   * @param {*} lineId line Id
   * @returns Promise
   */
  updateItem(productId: number, qty: number, line: CartLineModel | null) {
    if (line !== null) {
      const originalQty = line?.qty || 0
      qty -= originalQty
      this.addTransaction(productId, qty)
    }
  }
  /**
   * deleteItem : delete a cart line
   * @param {*} id cart line ID
   */
  deleteItem(id: number) {
    const cart = this.getCart()?.value || null
    const line: CartLineModel | null =
      cart?.lines?.find((line: CartLineModel) => line.id === id) || null

    if (line !== null) {
      const qty = line.qty * -1
      const productId: number | null = line?.productId || null
      if (productId !== null) {
        this.addTransaction(productId, qty)
      }
    }
  }

  async setDeliveryCarrier(carrierId: number) {
    const cart = this.getCart()?.value || null
    if (!cart?.uuid) return Promise.reject('No cart uuid')
    return await this.erp.post('/cart/set_delivery_carrier', {
      method_id: carrierId,
      uuid: cart.uuid
    })
  }
}
