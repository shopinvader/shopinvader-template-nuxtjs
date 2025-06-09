export default {
  slots: {
    root: 'relative flex flex-wrap p-3 max-md:flex-col md:p-5',
    tag: 'absolute left-10 top-16 z-10',
    header: 'w-full flex-grow',
    image: 'w-full py-4 md:w-1/2 md:pr-5 lg:w-3/5',
    content: 'w-full pt-5 md:w-1/2 md:px-2 lg:w-2/5'
  },
  components: {
    productImageList: {},
    productTags: {},
  },
}