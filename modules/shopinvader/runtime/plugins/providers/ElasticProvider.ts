import { ElasticFetch } from '@shopinvader/fetch'
import { ShopinvaderElasticConfig, ShopinvaderProvidersList } from '../../types/ShopinvaderConfig'

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
  config: ShopinvaderElasticConfig,
  isoLocale: string
): ShopinvaderProvidersList => {
  const allIndex: string[] = []
  const providers: ShopinvaderProvidersList = {}
  const indices = config?.indices || {}
  if (config?.url === null || !indices) {
    throw new Error('No elasticsearch config found')
  }
  for (const name in indices) {
    console.log('name', indices)
    const indexName = `${indices[name]}_${isoLocale}`

    providers[name] = new ElasticFetch(
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
