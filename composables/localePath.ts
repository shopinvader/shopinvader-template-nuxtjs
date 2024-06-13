// return localized url for the given path
export const localePath = (path: string, locale?: string): string => {
  const { $localePath } = useNuxtApp()
  if ($localePath) {
    const typedFct = $localePath as (path: string, locale?: string) => string
    return typedFct(path, locale)
  }
  return path
}
// return the translated string for the given key
export const $t = (key: string, params?: any): string => {
  const { $t } = useNuxtApp()
  if ($t) {
    const typedFct = $t as (key: string, params?: any) => string
    return typedFct(key, params) || key
  }
  return key
}
