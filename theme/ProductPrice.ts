export type ProductPriceUI = {
  slots: {
    root: string;
    value: string;
    tax: string;
    original: string;
  };
}
export default{
  slots: {
    root: 'flex w-full flex-wrap items-center justify-end gap-x-1 font-bold',
    value: 'font-semibold leading-6',
    tax: 'text-xs font-normal text-gray-500',
    original: 'text-lg font-normal text-gray-500 line-through',
  },
  variants: {
    discounted: {
      true: {
        value: 'text-accent',
        original: 'text-gray-500 line-through text-sm',
      }
    }
  },
} as ProductPriceUI;