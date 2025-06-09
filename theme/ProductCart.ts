import type { ProductCartConfirmationUI } from "./ProductCartConfirmation";
import type { ButtonProps, DrawerProps, InputProps } from "@nuxt/ui";
export interface ProductCartUI {
  slots: {
    root: string;
    input: string;
    button: string;
    count: string;
    confirmation: string;
  };
  components: {
    button: ButtonProps['ui'];
    input: InputProps['ui'];
    drawer: DrawerProps['ui'];
    ProductCartConfirmation: ProductCartConfirmationUI;
  };
}
export default {
  slots: {
    root: 'flex flex-row flex-wrap items-center justify-end gap-2',
    input: '',
    button: 'btn btn-primary px-14 text-white hover:btn-primary hover:shadow-2xl',
    count: 'flex w-full flex-grow justify-end gap-2 text-right text-sm',
    confirmation: 'border-0'
  },
  components: {
    button: {},
    input: {},
    drawer: {},
    ProductCartConfirmation: {}
  },
} as ProductCartUI;