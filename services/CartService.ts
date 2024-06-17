import type { Address, Product } from '#models'
import {
  CartLine as CartLineModel,
  Cart as CartModel,
  DeliveryCarrier,
  PaymentData,
  Sale
} from '#models'
import { Cart, CartTransaction, WebStorageCartStorage } from '@shopinvader/cart'

import { Service } from '#services'
import type { ErpFetch } from '@shopinvader/fetch'
import { storeToRefs } from 'pinia'
import isEqual from '~/utils/IsEqual'

class CartObserver {
  prevCartData: any
  callback: (cart: CartModel, syncError: boolean) => void // Nuxt context
  constructor(callback: (cart: CartModel, syncError: boolean) => void) {
    this.callback = callback
  }

  onCartUpdated(data: any) {
    let cartData: any = {}
    if (typeof data?.getData == 'function') {
      cartData = { ...data.getData() }
    }
    if (isEqual(this.prevCartData, cartData)) {
      return
    }
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
            options: line?.options || {},
            hasPendingTransactions
          }
        }
        const cartLine = new CartLineModel(lineData)
        cartLines.push(cartLine)
      }
      CartModel.setLines(cart, cartLines)
      this.callback(cart, syncError)
    }
    this.prevCartData = cartData
  }
}

export class CartService extends Service {
  services: ShopinvaderServiceList | null = null
  serviceName = 'cart'
  endpoint: string = 'cart'
  syncUrl: string = 'cart/sync'
  erp: any // ErpFetch
  cart: any | null
  id: number | null = null // Cart ID
  products: Product[] = []
  debug = false
  constructor(erp: ErpFetch) {
    super()
    this.erp = erp
    this.setCart = this.setCart.bind(this)
    this.transformCart = this.transformCart.bind(this)
  }
  init(services: ShopinvaderServiceList): void {
    super.init(services)
    if (!import.meta.env.SSR) {
      const observer = new CartObserver(this.setCart)
      this.cart = new Cart(this.erp, new WebStorageCartStorage(window.localStorage), {
        syncUrl: this.syncUrl,
        debug: true
      })
      this.cart.registerObserver(observer)

      /** Get last stored cart before fetching API with syncWithRetry */
      if (window?.localStorage?.getItem('cart')) {
        let data = JSON.parse(window.localStorage.getItem('cart') || '{}')

        const urlParams = new URLSearchParams(window.location.search)
        const status = urlParams.get('status') || null
        if (status == 'success' || status == 'pending') {
          this.store().setLastSale(data)
          this.cart?.clearPendingTransactions()
          data = {}
        }
        this.setCart(new CartModel(data))
        this.sync()
      }
    }
    if (services?.auth && services?.cart) {
      const { auth } = services
      /** Retrieve cart content on user login */
      auth?.onUserLoaded((_user) => {
        services.cart.sync()
      })
      /** Clear cart after user logout */
      auth?.onUserUnLoaded(() => {
        services.cart.clear()
      })
    }
  }
  sync() {
    this.cart?.syncWithRetry()
  }
  getCart(): Ref<CartModel | null> {
    if (!import.meta.env.SSR) {
      const store = this.store()
      const { cart } = storeToRefs(store)
      return cart || ref(null)
    }
    return ref(null)
  }

  async setCart(cart: CartModel | null) {
    /** Store the cart on the localstorage */

    if (cart?.toJSON) {
      window.localStorage.setItem('cart', JSON.stringify(cart?.toJSON()))
    }
    const store = this.store()
    if (cart == null) {
      store.setCart(null)
      window.localStorage.removeItem('cart')
      return
    }
    cart = await this.transformCart(cart)
    cart.hasPendingTransactions =
      cart?.lines?.some((i: CartLineModel) => {
        return i.hasPendingTransactions === true
      }) || false
    cart.loaded = true

    store.setCart(cart)
  }
  async transformCart(cart: CartModel): Promise<CartModel> {
    /** Fetch cart product to product index */
    if (cart?.lines?.length > 0 && this.services?.products !== null) {
      const ids: number[] =
        cart.lines
          .map((l: CartLineModel) => l.productId || 0)
          .filter((i: number | null) => i !== null && !this.products.some((p) => i === p?.id)) || []

      if (ids.length > 0) {
        const { hits } = (await this.services?.products.getByIds(ids)) || { hits: [] }
        const products = hits.reduce((acc: any, product: Product) => {
          return [...acc, ...(product.variants || [])]
        }, [])
        if (Array.isArray(products)) {
          this.products = [...this.products, ...products]
        }
      }

      for (const line of cart.lines || []) {
        const product = this.products.find((p: Product) => p.id === line.productId) || null

        if (product !== null) {
          line.product = product
        }
      }
    }
    if (this.services?.settings) {
      const countries = (await this.services?.settings?.get('countries')) || []
      if (countries?.length > 0) {
        if (cart.delivery.address) {
          const address = cart.delivery.address
          cart.delivery.address.country =
            countries.find((c: any) => c.id === address?.country?.id) || null
        }
        if (cart.invoicing.address) {
          const address = cart.delivery.address
          cart.invoicing.address.country =
            countries.find((c: any) => c.id === address?.country?.id) || null
        }
      }
    }
    return cart
  }
  addTransaction(id: number, qty: number, options?: any) {
    if (id != null && qty != null && !isNaN(qty)) {
      this.cart.addTransaction(new CartTransaction(id, qty, undefined, options || null))
    }
  }

  applyDeltaOnItem(productId: number, delta: number, options?: any) {
    this.addTransaction(productId, delta, options || null)
  }

  /**
   * addItem : add an item to cart
   * @param {*} id product Id
   * @param {*} options Options
   * @returns Promise
   */
  addItem(productId: number, qty: number, options?: any) {
    this.addTransaction(productId, qty || 1, options || null)
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
      this.addTransaction(productId, qty, line?.options || null)
    }
  }
  /**
   * deleteItem : delete a cart line
   * @param {*} id cart line ID
   */
  deleteItem(line: CartLineModel) {
    if (line !== null) {
      const qty = line.qty * -1
      const productId: number | null = line?.productId || null
      if (productId !== null) {
        this.addTransaction(productId, qty, line?.options || null)
      }
    }
  }

  async setAddress(type: string, address: Address) {
    const cart = this.getCart()?.value || null
    if (!cart) return null
    if (type == 'delivery') {
      cart.delivery.address = address
    } else {
      cart.invoicing.address = address
    }
    await this.update(cart)
  }

  /**
   * Set shipping mode on the current cart
   * Get carrier list via DeliveryCarrier service
   * @param carrierId selected carrier ID
   */
  async setDeliveryCarrier(carrierId: number) {
    const data: any = await this.erp.post(`${this.endpoint}/current/set_carrier`, {
      carrier_id: carrierId
    })
    if (data?.id) {
      this.setCart(new CartModel(data))
    }
  }

  async update(cart: CartModel) {
    const data: any = await this.erp.post(`${this.endpoint}/current/update`, {
      client_order_ref: cart.orderRef || '',
      delivery: {
        address_id: cart?.delivery?.address?.id || null
      },
      invoicing: {
        address_id: cart?.invoicing?.address?.id || null
      },
      note: cart.note || ''
    })
    await this.setCart(new CartModel(data))
  }

  /**
   * Get last confirmed cart from the pinia store
   * and retrieve products from the sales service
   * @returns Sale | null
   */
  async getLastSale(): Promise<Sale | null> {
    let sale: Sale | null = null
    const data = this.store()?.lastSale || {}
    if (data) {
      const saleService = this.services?.sales
      sale = new Sale(data)
      if (saleService) {
        sale = await saleService.fetchProductToSale(sale)
      }
    }
    return sale
  }

  /**
   * Retrieves all delivery carriers of the cart
   * @returns A promise that resolves to an array of DeliveryCarrier objects.
   */
  async getDeliveryCarrier(): Promise<DeliveryCarrier[]> {
    const url = `${this.endpoint}/current/delivery_carriers`
    const data = await this.erp?.get(url, [], null)
    if (Array.isArray(data)) {
      return data.map((item: any) => new DeliveryCarrier(item))
    }
    return []
  }

  clear() {
    this.cart?.clearPendingTransactions()
    this.setCart(new CartModel({}))
  }

  /**
   * Apply a coupon to the cart
   * @param couponCode The coupon code to apply
   */
  async applyCoupon(code: string) {
    if (!code) return null
    const cart: any = await this.erp.post(`${this.endpoint}/current/coupon`, {
      code
    })

    if (cart?.id) {
      this.setCart(new CartModel(cart))
    }
  }

  async getPayable(): Promise<PaymentData | null> {
    const data = await this.erp.get(`${this.endpoint}/current/payable`, {})
    if (data) {
      return new PaymentData(data)
    }
    return null
  }
}
