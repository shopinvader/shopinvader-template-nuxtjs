import { ShopinvaderConfig, ShopinvaderProvidersList } from '../../types/ShopinvaderConfig'
import { initElasticProvider } from './ElasticProvider'
import { initErpProvider } from './ErpProvider'

/**
 * Return the list of providers available in the app according to the config
 * The config is read from the nuxt.config file
 * @returns ShopinvaderProvidersList
 */
export const initProviders = (
  config: ShopinvaderConfig,
  isoLocale: string
): ShopinvaderProvidersList => {

  if (config == null) {
    throw new Error('No shopinvader config found')
  }
  const { elasticsearch, erp } = config

  let erpProviders = {} as ShopinvaderProvidersList
  let elasticProviders = {} as ShopinvaderProvidersList
  if (erp) {
    erpProviders = initErpProvider(erp)
  }
  if (elasticsearch) {
    elasticProviders = initElasticProvider(elasticsearch, isoLocale)
  }
  return {
    ...erpProviders,
    ...elasticProviders
  }
}
