export default defineNuxtPlugin((/* nuxtApp */) => {
  return {
    provide: {
      filter: {
        currency(value: number) {
          const formatter = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })
          return formatter.format(value);
        }
      }
    }
  }
})
