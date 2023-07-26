
import { installModule } from '@nuxt/kit'
import { Nuxt } from 'nuxt/schema'

/**
 * Add i18n module to the app with top layer locales
 * @param nuxt
 */
export const addI18n = async (nuxt: Nuxt) => {
  const layers = nuxt.options._layers
  const appLayer = nuxt.options._layers[0]
  const locales = appLayer.config?.i18n?.locales || []
  let config = {}
  if(layers.length > 1) {

    for(let layer of layers) {
      const { config } = layer
      if(config?.i18n) {
        config.i18n.locales =
          config.i18n.locales?.filter((locale:any) => locales.some((l) => l?.code == locale.code)) || []
      }
    }
    nuxt.options.i18n = {
      ...nuxt.options.i18n,
      locales,
      defaultLocale: locales[0]?.code,
      strategy: "prefix_except_default"
    }
    config = nuxt.options.i18n || {}
  }
  await installModule('@nuxtjs/i18n', config, nuxt)
}
