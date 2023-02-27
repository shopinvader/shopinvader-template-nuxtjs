export const localePath = (path: string, locale?: string) => {
  return useNuxtApp()?.$localePath(path, locale) || null
}
