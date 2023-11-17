import { Cart, CartTransaction, WebStorageCartStorage } from '@shopinvader/cart'
import {
  Cart as CartModel,
  Product,
  CartLine as CartLineModel,
  Address
} from '#models'
import { Service, ProductService } from '#services'
import { storeToRefs } from 'pinia'
import isEqual from 'lodash.isequal'

class CartObserver {
  prevCartData: any
  callback: (cart: CartModel, syncError: boolean) => void // Nuxt context
  constructor(callback: (cart: CartModel, syncError: boolean) => void) {
    this.callback = callback
  }

  onCartUpdated(data: any) {
    let cartData = {}
    if(typeof data?.getData == 'function') {
      cartData = {...data.getData()}
    }
    if(isEqual(this.prevCartData, cartData)) {
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
            options: line?.options || { contact_id: 1},
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
  serviceName = 'cart'
  erp: any // ErpFetch
  cart: any | null
  id: number | null = null // Cart ID
  products: Product[] = []
  productService: ProductService | null = null
  debug = false
  constructor(erp: any, productService: ProductService) {
    super()
    this.erp = erp
    this.productService = productService
    this.setCart = this.setCart.bind(this)
    this.transformCart = this.transformCart.bind(this)
    if (!import.meta.env.SSR) {
      const observer = new CartObserver(this.setCart)
      this.cart = new Cart(
        this.erp,
        new WebStorageCartStorage(window.localStorage), {
          syncUrl: 'carts/sync',
          debug: this.debug
        }
      )
      this.cart.registerObserver(observer)
      /** Get last stored cart before fetching API with syncWithRetry */
      if (window?.localStorage?.getItem('cart')) {
        this.setCart(JSON.parse(window.localStorage.getItem('cart') || '{}'))
      }
      if(window?.requestIdleCallback) {
        requestIdleCallback(() => {
          this.cart.syncWithRetry()
        })
      }
    }
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

    if(cart?.toJSON) {
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
    if (cart?.lines?.length > 0 && this.productService !== null) {
      const ids: number[] =
      cart.lines
          .map((l: CartLineModel) => l.productId || 0)
          .filter(
            (i: number | null) =>
              i !== null && !this.products.some((p) => i === p?.id)
          ) || []

      if (ids.length > 0) {
        const {hits} = (await this.productService.getByIds(ids)) || []
        const products = hits.reduce((acc: any, product: Product) => {
          return [...acc, ...product.variants || []]
        }, [])
        if (Array.isArray(products)) {
          this.products = [...this.products, ...products]
        }
      }

      for (const line of cart.lines || []) {
        const product =
          this.products.find((p: Product) => p.id === line.productId) || null

        if (product !== null) {
          line.product = product
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
    const cart = this.getCart()?.value || null
    if (line !== null) {
      const qty = line.qty * -1
      const productId: number | null = line?.productId || null
      if (productId !== null) {
        this.addTransaction(productId, qty, line?.options || null)
      }
    }
  }

  async setAddress(type: string, address:Address) {
    const cart = this.getCart()?.value || null
    if(!cart) return null
    if(type == 'delivery') {
      cart.delivery.address = address
    } else {
      cart.invoicing.address = address
    }
    this.update(cart)
  }

  /**
   * Set shipping mode on the current cart
   * Get carrier list via DeliveryCarrier service
   * @param carrierId selected carrier ID
   */
  async setDeliveryCarrier(carrierId: number) {
    const cart = this.getCart()?.value || null
    if (!cart?.uuid) return Promise.reject('No cart uuid')
    const data: any = await this.erp.post('/cart/set_delivery_method', {
      method_id: carrierId,
      uuid: cart.uuid
    })
    if (data?.id) {
      this.setCart(new CartModel(cart))
    }
  }
  async update(cart: CartModel) {
    const data: any = await this.erp.post('carts/update', {
      client_order_ref: cart.orderRef || '',
      delivery: {
        address_id: cart?.delivery?.address?.id || null
      },
      invoicing: {
        address_id: cart?.invoicing?.address?.id || null
      },
      note: cart.note || ''
    })
    await this.setCart(data)
  }
  clear() {
    this.setCart(new CartModel({}))

  }
}
