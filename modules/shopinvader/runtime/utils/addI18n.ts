import { installModule } from '@nuxt/kit'
import type { LocaleObject } from '@nuxtjs/i18n'
import type { Nuxt } from 'nuxt/schema'

/**
 * Manually add i18n module to the app with top layer locales.
 * This is needed because the i18n module merge all locales from all layers.
 * We don't want that. We want to keep only the App layer locales.
 * This method will be called by the Shopinvader module at build time.
 * @param nuxt
 */
export const addI18n = async (nuxt: Nuxt) => {
  const layers = nuxt.options._layers
  const appLayer = nuxt.options._layers[0]
  const appLocales = appLayer.config?.i18n?.locales || []
  // Get the default locale from the app layer
  let appDefaultLocale = appLayer.config?.i18n?.defaultLocale
  if (!appDefaultLocale) {
    // If not set, take the first locale as default
    appDefaultLocale = (appLocales[0] as LocaleObject)?.code
  }
  let config = {}
  if (layers.length > 1) {
    for (const layer of layers) {
      if (layer.config?.i18n) {
        const i18nLayerConfig: any = layer.config.i18n
        // Remove locales that are not in the app layer
        i18nLayerConfig.locales =
          i18nLayerConfig.locales?.filter((locale: any) =>
            appLocales.some((l) => (l as LocaleObject)?.code == locale.code)
          ) || []
      }
    }
    // Set Nuxt i18n config
    nuxt.options.i18n = {
      ...nuxt.options.i18n,
      locales: appLocales,
      defaultLocale: appDefaultLocale
    }
    config = nuxt.options.i18n || {}
  }
  // Install the i18n module
  await installModule('@nuxtjs/i18n', config, nuxt)
}
