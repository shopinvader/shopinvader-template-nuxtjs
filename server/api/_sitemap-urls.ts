
import { ElasticFetch } from '@shopinvader/fetch'
import { initProviders } from '../../modules/shopinvader/runtime/plugins/providers'
import { CatalogService } from '../../services'
/**
 * Provide the list of URLs to be included in the sitemap
 */
export default cachedEventHandler(
  async () => {
    let data: any = []
    const runtimeConfig = useRuntimeConfig()
    const config =
      runtimeConfig?.public?.shopinvader || runtimeConfig?.shopinvader || null
    //const localeConfig = runtimeConfig?.i18n?.locales || null
    /** Elastic Provider */
    const providers = initProviders(config, '*')
    if (providers) {
      const catalogService = new CatalogService(
        providers?.elasticsearch as ElasticFetch
      )
      const response = await catalogService.search({ size: 5000 })
      data = response?.rawsHits?.map((hit: any) => {
        return {
          loc: hit.url_key,
          lastmod: new Date()
        }
      })
    }
    return data
  },
  {
    name: 'sitemap-dynamic-urls',
    maxAge: 60 * 10 // cache URLs for 10 minutes
  }
)
