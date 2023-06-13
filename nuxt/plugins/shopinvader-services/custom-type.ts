import { Cart, Product } from '~/models'
import { Category, CategoryParent } from '~/models/Category'

export default definePayloadPlugin(() => {
  /**Cart */
  definePayloadReducer(
    'Cart',
    (value) => value instanceof Cart && value.toJSON()
  )
  definePayloadReviver('Cart', (data) => new Cart(data))

  /**Category */
  definePayloadReviver('Category', (data) => new Category(data))
  definePayloadReducer(
    'Category',
    (value) => value instanceof Category && value.toJSON()
  )

  /**CategoryParent */
  definePayloadReviver('CategoryParent', (data) => new CategoryParent(data))
  definePayloadReducer(
    'CategoryParent',
    (value) => value instanceof CategoryParent && value.toJSON()
  )

  /**Product */
  definePayloadReviver('Product', (data) => new Product(data))
  definePayloadReducer(
    'Product',
    (value) => value instanceof Product && value.toJSON()
  )
})
