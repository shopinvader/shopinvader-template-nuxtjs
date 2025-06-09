export type ProductStockUI = {
  slots: {
    root: string
    icon: string
    text: string  
  }
}
export default {
  slots: {
    root: 'flex gap-1 items-start',
    icon: 'text-lg text-green-500',
    text: 'text-sm',
  },
  variants: {
    state: {
      in_stock: {
        icon: 'text-green-500',
        text: '',
      },
      in_limited_stock: {
        icon: 'text-orange-500',
        text: '',
      },
      resupplying: {
        icon: 'text-blue-500',
        text: 'text-gray-400',
      },
      out_of_stock: {
        icon: 'text-red-500',
        text: 'text-gray-400',
      },
      ending_soon: {
        icon: 'text-yellow-500',
        text: 'text-gray-400',
      },

      soon_available: {
        icon: 'text-purple-500',
        text: '',
      },
    },
  },
}