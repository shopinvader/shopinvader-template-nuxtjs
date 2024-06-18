import { ElasticFetch } from '@shopinvader/fetch'
import type { ShopinvaderElasticConfig } from '../../types/ShopinvaderConfig'

export const fetchElastic = async (url: string, options: any) => {
  console.log('[fetchElastic] url', url, options)
  let response = null
  response = await fetch(url, options)
  if (response.status !== 200) {
    // Read body to get the error message
    const body = await response.text()
    console.error('[fetchElastic] error (bad response status)', url, options, response, body)
    // Create error with the body
    const error = new Error(
      '[fetchElastic] error, bad response status: ' +
        url +
        ' ' +
        response.status +
        ' ' +
        response.statusText +
        ' ' +
        body
    )
    throw error
  }
  return response
}

/**
 * Init the elasticsearch providers
 * @param options
 * @returns ShopinvaderElasticConfig List of providers for elasticsearch connection
 */
export const createElasticProviders = (
  config: ShopinvaderElasticConfig,
  isoLocale: string
): { name: string; elasticFetch: ElasticFetch }[] => {
  const elasticProviders: { name: string; elasticFetch: ElasticFetch }[] = []
  const allIndexes: string[] = []
  const indices = config?.indices || {}
  if (!config?.url) {
    throw new Error('Missing url in elasticsearch config')
  }
  if (!indices) {
    throw new Error('Missing indices in elasticsearch config')
  }
  // Check if key 'products' is present
  if (!indices.products) {
    throw new Error('Missing products index in elasticsearch config')
  }
  // Check if key 'categories' is present
  if (!indices.categories) {
    throw new Error('Missing categories index in elasticsearch config')
  }
  // Parse list of providers
  for (const name in indices) {
    const indexName = `${indices[name]}_${isoLocale}`
    if (name === 'products' || name === 'categories') {
      // Add products and categories
      elasticProviders.push({
        name,
        elasticFetch: new ElasticFetch(config.url, indexName, fetchElastic)
      })
    }
    // Store all indexes for full search
    allIndexes.push(indexName)
  }
  // Add the full search index
  elasticProviders.push({
    name: 'elasticsearch',
    elasticFetch: new ElasticFetch(config.url, allIndexes.join(','), fetchElastic)
  })
  return elasticProviders
}
