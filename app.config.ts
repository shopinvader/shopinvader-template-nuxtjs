export default defineAppConfig({
  settings: {
    countries: [],
    titles: [],
    states: [],
    currencies: []
  },
  icon: {
    class: 'icon',
    aliases: {
      addresses: 'ph:address-book-light',
      profile: 'ph:person-light',
      sales: 'ph:list-dashes',
      check: 'ph:check',
      left: 'ph:arrow-left',
      right: 'ph:arrow-right',
      logout: 'ph:power',
      search: 'ph:magnifying-glass-light',
      'search-circle': 'ph:magnifying-glass-light',
      plus: 'ph:plus-bold',
      minus: 'ph:minus-bold',
      delete: 'ph:trash',
      remove: 'ph:trash',
      edit: 'ph:pencil',
      info: 'ph:info',
      close: 'ph:x',
      user: 'ph:user',
      'user-logged': 'ph:user-duotone',
      'user-circle': 'ph:user-circle',
      'close-circle': 'ph:x',
      phone: 'ph:phone',
      variants: 'fluent:box-multiple-20-regular',
      printer: 'ph:printer',
      error: 'ph:warning-circle',
      cart: 'ph:bag-light',
      shipping: 'ph:package',
      billing: 'ph:receipt',
      email: 'ph:envelope',
      warning: 'ph:warning',
      attention: 'ph:info',
      down: 'ph:caret-down-light',
      up: 'ph:caret-up-light',
      home: 'ph:house',
      history: 'ph:clock-counter-clockwise-fill',
      view: 'ph:eye-light',
      hide: 'ph:eye-slash-duotone',
      location: 'ph:map-pin-fill',
      menu: 'ph:list',
      download: 'ph:download-simple-fill',
      carrier: 'ph:package-duotone',
      'product-list': 'ph:list',
      'product-grid': 'ph:grid-nine-fill'
    }
  },
  animations: {
    productLinks: (index: any) => {
      return {
        initial: {
          opacity: 0,
          y: 100
        },
        enter: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 300,
            type: 'spring',
            stiffness: '50',
            delay: index * 100
          }
        }
      }
    },
    searchProduct: (index: any) => {
      return {
        initial: {
          opacity: 0
        },
        enter: {
          opacity: 1,
          transition: {
            duration: 300,
            type: 'spring',
            stiffness: '50',
            delay: index * 100
          }
        }
      }
    },
    cartLines: (index: any) => {
      return {
        initial: {
          opacity: 0,
          y: -100
        },
        enter: {
          y: 0,
          opacity: 1,
          transition: {
            duration: 100,
            type: 'spring',
            stiffness: '50',
            delay: index * 200
          }
        }
      }
    }
  },
  theme: {
    logo: process.env.VUE_APP_LOGO_URL || ''
  },
  search: {
    filters: []
  }
})
