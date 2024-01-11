

export default defineAppConfig({
  nuxtIcon: {
    aliases: {
      addresses:"ph:address-book-light",
      profile:"ph:person-light",
      sales:"ph:list-dashes",
      check: "ph:check",
      left: "ph:arrow-left",
      right: "ph:arrow-right",
      logout: "ph:power",
      search: "mdi:magnify",
      "search-circle": "ic:round-search",
      plus: "mdi:plus",
      delete: "mdi:trash",
      remove: "ph:trash",
      edit: "ph:pencil",
      info: "ph:info",
      close: "ph:x",
      user: "ph:user",
      "user-logged": "ph:user-duotone",
      "user-circle": "ph:user-circle",
      "close-circle": "ic:round-close",
      phone: "ph:phone",
      variants: "fluent:box-multiple-20-regular",
      printer: "ph:printer",
      error: "ph:warning-circle",
      cart: "clarity:shopping-bag-line",
      shipping: "ph:package",
      billing: "ph:receipt",
      warning: "ph:warning",
      attention: "iconamoon:attention-circle-thin",
      down: "ph:caret-down-light",
      up: "ph:caret-up-light",
      home: "ph:house",
      history: "ic:baseline-history",
      view: "clarity:eye-line",
      "hide": "clarity:eye-hide-line",
      location: "ic:sharp-location-on",
      menu: "solar:hamburger-menu-outline",
      download: "material-symbols:download-for-offline-outline",
    },
  },
  animations: {
    productLinks: (index:any) => {
      return {
        initial:{
          opacity: 0,
          y: 100,
        },
        visibleOnce: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 300,
            type: 'spring',
            stiffness: '50',
            delay: index * 100,
          },
        }
      }
    },
    searchProduct: (index:any) => {
      return {
        initial:{
          opacity: 0,
        },
        visibleOnce: {
          opacity: 1,
          transition: {
            duration: 300,
            type: 'spring',
            stiffness: '50',
            delay: index * 100,
          },
        }
      }
    },
    cartLines: (index:any) => {
      return {
        initial:{
          opacity: 0,
          y: -100,
        },
        visibleOnce: {
          y: 0,
          opacity: 1,
          transition: {
            duration: 100,
            type: 'spring',
            stiffness: '50',
            delay: index * 200,
          },
        }
      }
    }
  }
})
