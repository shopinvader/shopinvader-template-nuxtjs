import type { ProductImageUI } from "./ProductImage"
import type { ProductPriceUI } from "./ProductPrice"
import type { ProductStockUI } from "./ProductStock"
import type { ProductTagsUI } from "./ProductTags"

export type ProductHitUI = {
  slots: {
    root: string
    header: string
    body: string
    image: string
    footer: string
    tag: string
    title: string
    desc: string
  },
  components: {
    productImage: ProductImageUI
    productTags: ProductTagsUI
    productPrice: ProductPriceUI
    productStock: ProductStockUI
  },
}
export default {
  slots: {
    root: 'flex flex-col relative overflow-hidden rounded-none p-0 sm:p-0 items-stretch',
    header: 'p-0 sm:px-0 pb-2',
    body: 'flex-1 flex flex-col px-2 sm:px-3  items-stretch',
    image: "relative aspect-square max-h-full cursor-pointer overflow-hidden pb-2",
    footer: 'p-0 sm:px-0',
    tag: 'absolute left-1 top-2 z-10',
    title: 'cursor-pointer line-clamp-2',
    desc: 'text-sm line-clamp-3 flex-1 ',
    variants: 'text-xs text-gray-600',
    stock: 'text-xs text-gray-600 py-4',
    price: 'text-right',
    actions: 'pt-2',
  },
  components: {
    productImage: {},
    productTags: {},
    productPrice: {},
    productStock: {},
  },
  variants: {
    orientation: {
      inline: {
        root: 'flex-row',
        image: 'w-1/5 md:w-1/6',
        body: 'flex-col pl-6 md:flex-row',
        title: 'md:order-1 md:w-1/3',
        desc: 'md:order-3 md:w-2/3',
        price: 'md:order-2 md:w-1/3 md:border-l md:p-3',
        actions: 'md:order-5 md:w-1/3 md:p-3',
        stock: 'md:order-4 md:w-2/3',
      },
      block: {
        root: 'flex-col',
      },
    }
  }
}