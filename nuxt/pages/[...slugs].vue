<template>
  <component :is="component" v-bind="settings" />
</template>

<script lang="ts">
import { Product } from '~~/models'
import { Category } from '~~/models/Category'
import { Page } from '~~/models/cms/Page'
import ProductDetail from '~~/components/product/ProductDetail.vue'
import CategoryDetail from '~~/components/category/CategoryDetail.vue'
import CmsPage from '~~/components/cms/Page.vue'

const getCmsPage = async (fullpath: string | null): Promise<Page | null> => {
  const { findPage } = useCMS()
  fullpath = '/' + fullpath
  const cmsPage: Page | null =
    (await findPage({ filters: { fullpath } })) || null
  return cmsPage
}

const getEntity = async (
  fullpath: string | null
): Promise<Product | Category | Page | null> => {
  let entity: Product | Category | Page | null = null
  if (fullpath === null) return null
  const catalogService = useShopinvaderService('catalog')
  const result = await catalogService?.getByURLKey(fullpath)
  entity = result?.hits?.[0] || null
  if (!entity) {
    entity = await getCmsPage(fullpath)
  }
  return entity || null
}

export default defineNuxtComponent({
  fetchKey: 'wildcard',
  components: {
    'product-detail': ProductDetail,
    'category-detail': CategoryDetail,
    'cms-page': CmsPage
  },
  data() {
    return {
      product: null as Product | null,
      category: null as Category | null,
      page: null as Page | null,
      path: null as string | null
    }
  },
  async asyncData() {
    const route = useRoute()
    const slugs: string[] = (route.params.slugs as string[]) || []
    const path = ref((slugs.join('/') as string) || null)
    const result = await getEntity(path.value)
    const product = result instanceof Product ? result : null
    const page = result instanceof Page ? result : null
    const category = result instanceof Category ? result : null

    if (!product && !page && !category) {
      throw new Error('Not found')
    }
    useHead({
      title: product?.name || category?.name || page?.title || '',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
            product?.metaDescription ||
            category?.metaDescription ||
            page?.seo?.metaDescription ||
            ''
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: product?.metaKeywords || category?.metaKeywords || ''
        }
      ]
    })
    return { product, category, page, path }
  },
  computed: {
    component(): string {
      if (this.product) return 'product-detail'
      if (this.category) return 'category-detail'
      if (this.page) return 'cms-page'
      return ''
    },
    settings(): any {
      if (this.product) return { product: this.product }
      else if (this.category) return { category: this.category }
      else if (this.page) return { page: this.page }
      return {}
    }
  }
})
</script>
