/**
 * Provide the list of URLs to be included in the sitemap
 *  Todo: check that this is still called in the last version of @nuxtjs/sitemap
 */
const getAllUrlKeys = async (index: string) => {
  const runtimeConfig = useRuntimeConfig()
  const {elasticsearch = null} =
    runtimeConfig?.public?.shopinvader || runtimeConfig?.shopinvader || null
  const url = `${elasticsearch?.url || ""}/${index}_*/_search`
  const data: any = await $fetch(url, {
    method: "POST",
    body: JSON.stringify({
      query: {
        match_all: {},
      },
      size: 0,
      aggs: {
        url_keys: {
          terms: {
            field: "url_key",
            size: 10000,
          },
        },
      },
    }),
  })
  return (
    data?.aggregations?.url_keys?.buckets?.map((u: any) => u?.key || "") || []
  )
}
export default cachedEventHandler(
  async () => {
    let data: any = []
    const runtimeConfig = useRuntimeConfig()
    const {elasticsearch = null} =
      runtimeConfig?.public?.shopinvader || runtimeConfig?.shopinvader || null

    if (elasticsearch) {
      /** Elastic Provider */
      const urlProducts =
        (await getAllUrlKeys(elasticsearch?.indices?.products || "")) || []
      const urlCategories =
        (await getAllUrlKeys(elasticsearch?.indices?.categories || "")) || []
      data = [...urlProducts, ...urlCategories]
    }
    return data.map((url: string) => {
      return {
        url: `/${url}`,
        changefreq: "daily",
      }
    })
  },
  {
    swr: true,
    maxAge: 10 * 60,
  }
)
