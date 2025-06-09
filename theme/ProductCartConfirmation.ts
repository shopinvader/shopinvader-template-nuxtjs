export interface ProductCartConfirmationUI {
  slots: {
    root: string;
    header: string;
    line: string;
    lineTitle: string;
    links: string;
    footer: string;
    back: string;
    checkout: string;
  };
  components: {
    ProductLinks: Record<string, unknown>;
    card: {
      body: string;
    };
  };
}
export default {
  slots: {
    root: ' ring-0 px-0 sm:px-0 flex flex-col justify-between',
    header: 'font-heading text-lg font-semibold',
    line: 'flex-1',
    lineTitle: 'text-sm font-semibold text-gray-500',
    links: 'flex flex-col items-center justify-center gap-2',
    footer: 'w-full flex justify-between gap-2 items-center',
    back:'',
    checkout:''
  },
  components: {
    ProductLinks: {},
    card: {
      body: 'flex-1'
    }
  }
} as ProductCartConfirmationUI;