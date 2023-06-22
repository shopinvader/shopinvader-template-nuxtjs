export const localePath = (path: string, locale?: string) => {
  if (useNuxtApp()?.$localePath) {
    return useNuxtApp()?.$localePath(path, locale) || null
  }
  return null
}
export const $t = (locale: string, params?: any) => {
  if (useNuxtApp()?.$t) {
    return useNuxtApp()?.$t(locale, params) || null
  }
  return null
}
