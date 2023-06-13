import { ElasticFetch } from '@shopinvader/fetch'
import { ShopinvaderElasticConfig, ShopinvaderProvidersList } from '../type'

export const fetchElastic = async (url: string, options: any) => {
  const response = await fetch(url, options)
  if (response.status !== 200) {
    throw new Error()
  }
  return response
}
/**
 * Init the elasticsearch providers
 * @param options
 * @returns ShopinvaderElasticConfig List of providers for elasticsearch connection
 */
export const initElasticProvider = (
  config: ShopinvaderElasticConfig
): ShopinvaderProvidersList => {
  const app = useNuxtApp()
  const isoLocale: string = app.$i18n?.localeProperties?.value?.iso || ''
  const allIndex: string[] = []
  const providers: ShopinvaderProvidersList = {}
  const indices = config?.indices || []
  if (config?.url === null || Array.isArray(indices) === false) {
    throw new Error('No elasticsearch config found')
  }
  for (const index of indices) {
    const indexName = `${index?.index}_${isoLocale}`
    providers[index.name] = new ElasticFetch(
      config.url,
      indexName,
      fetchElastic
    )
    allIndex.push(indexName)
  }
  providers['elasticsearch'] = new ElasticFetch(
    config.url,
    allIndex.join(','),
    fetchElastic
  )
  return providers
}
