import type { ErpFetch } from '@shopinvader/fetch'
import type { ShopinvaderConfig, ShopinvaderProvidersList } from '../../types/ShopinvaderConfig'
import { createElasticProviders } from './ElasticProvider'
import { createErpProvider } from './ErpProvider'

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
  if (!config.erp) {
    throw new Error('No shopinvader erp config found')
  }
  if (!config.elasticsearch) {
    throw new Error('No shopinvader elasticsearch config found')
  }
  // Load erp
  const shopinvaderProvidersList = {} as ShopinvaderProvidersList
  shopinvaderProvidersList.erp = createErpProvider(config.erp) as ErpFetch
  // Load elastic indexes
  const elasticProviders = createElasticProviders(config.elasticsearch, isoLocale)
  const products = elasticProviders.find((provider) => provider.name === 'products')
  if (!products) {
    throw new Error('No products provider found')
  }
  shopinvaderProvidersList.products = products.elasticFetch
  const categories = elasticProviders.find((provider) => provider.name === 'categories')
  if (!categories) {
    throw new Error('No categories provider found')
  }
  shopinvaderProvidersList.categories = categories.elasticFetch
  const elasticsearch = elasticProviders.find((provider) => provider.name === 'elasticsearch')
  if (elasticsearch) {
    shopinvaderProvidersList.elasticsearch = elasticsearch.elasticFetch
  }

  return shopinvaderProvidersList
}
