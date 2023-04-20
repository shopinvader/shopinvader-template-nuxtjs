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
  const cmsPage: Page | null =
    (await findPage({ filters: { fullpath } })) || null
  return cmsPage
}

const getEntity = async (
  fullpath: string | null
): Promise<Product | Category | Page | null> => {
  let entity: Product | Category | Page | null = null
  if (fullpath === null) return null
  const services = useShopinvaderServices()
  const result = await services?.catalog?.getByURLKey(fullpath)
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
      page: null as Page | null
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
    return { product, category, page }
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
