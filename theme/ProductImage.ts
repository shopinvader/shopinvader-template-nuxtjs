export type ProductImageUI = {
  slots: {
    root: string;
    image: string;
  };
};
export default {
  slots: {
    root: 'h-full w-full object-contain cursor-pointer flex items-center justify-center',
    image: 'hover:scale-105 transition-transform duration-200 ease-in-out',
  }
}