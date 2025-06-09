import type { ProductStockUI} from './ProductStock';
import type { ProductImageUI } from './ProductImage';
export type CartLineUI = {
  slots: {
    root: string
    content: string
    header: string
    image: string
    title: string
    subtitle: string
    stock: string
    quantity: string
    price?: string
    body?: string
    delete?: string,
    deleteLink?: string,
    footer?: string
  }
  components: {
    ProductStock?: ProductStockUI
    ProductImage?: ProductImageUI
  }
};
export default {
  slots: {
    root: 'w-full mb-4 ring-0 border-b border-gray-200 rounded-none ',
    content: 'grid grid-cols-6 gap-2 md:gap-x-4 py-0 sm:py-2',
    image: 'col-span-full flex items-center justify-center md:col-end-1 row-span-10 ',
    title: 'col-span-full md:col-start-2 leading-none font-heading',
    subtitle: 'col-span-full md:col-start-2 leading-none',
    header: 'col-span-full md:col-start-2',
    stock: 'col-span-full md:col-start-2',
    price: 'col-span-full md:col-start-2 flex items-center justify-end text-right gap-2',
    quantity: 'col-span-full md:col-start-2 flex flex-col text-sm sm:col-span-2',
    body: 'col-span-full md:col-start-2',
    delete: 'col-span-full md:col-start-2',
    deleteLink: 'underline',
    footer: 'row-start-1 col-span-full'
  },
  components: {
    ProductStock: {},
    ProductImage: {
      slots: {
        root: 'items-start flex justify-center w-full h-full',
        image: 'max-h-48'
      }
    },
  }
} as CartLineUI;