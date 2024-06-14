import { installModule } from '@nuxt/kit'
import type { LocaleObject } from '@nuxtjs/i18n'
import type { Nuxt } from 'nuxt/schema'

/**
 * Add i18n module to the app with top layer locales
 * @param nuxt
 */
export const addI18n = async (nuxt: Nuxt) => {
  const layers = nuxt.options._layers
  const appLayer = nuxt.options._layers[0]
  const locales = appLayer.config?.i18n?.locales || []
  let config = {}
  if (layers.length > 1) {
    for (const layer of layers) {
      const { config } = layer
      if (config?.i18n) {
        const i18nConfig: any = config.i18n
        i18nConfig.locales =
          config.i18n.locales?.filter((locale: any) =>
            locales.some((l) => (l as LocaleObject)?.code == locale.code)
          ) || []
      }
    }
    nuxt.options.i18n = {
      ...nuxt.options.i18n,
      locales,
      defaultLocale: (locales[0] as LocaleObject)?.code,
      strategy: 'prefix_except_default'
    }
    config = nuxt.options.i18n || {}
  }
  await installModule('@nuxtjs/i18n', config, nuxt)
}
