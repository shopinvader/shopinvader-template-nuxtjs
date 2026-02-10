<script setup lang="ts">
import type { Product } from '#models'

const props = defineProps({
  product: {
    type: Object as PropType<Product>,
    required: true
  },
  transformData: {
    type: Function as PropType<(data: any) => any>,
    default: (data) => data
  }
})
const localePath = useLocalePath()

const { product } = props
let productSchema = {}
if (product) {
  const image: string = product.images?.map((img: any) => img?.large?.src || null)[0] || ''
  if (product?.variantCount > 1) {
    const hasVariant: any[] =
      product.variants?.map((variant: Product) => {
        const data = variant.getStructuredData()
        data.url = withSiteUrl(localePath(`/${data.urlKey}`))
        return data
      }) || []

    productSchema = {
      '@context': 'https://schema.org/',
      '@type': 'ProductGroup',
      productGroupID: product.urlKey,
      name: product.model?.name,
      description: product.shortDescription,
      url: withSiteUrl(localePath(`/${product.urlKey}`)),
      image,
      hasVariant
    }
  } else {
    const data = product.getStructuredData()
    data.url = withSiteUrl(localePath(`/${product.urlKey}`))
    productSchema = data
  }
}
if (props?.transformData && typeof props?.transformData === 'function') {
  productSchema = props?.transformData(productSchema)
}
useSchemaOrg(productSchema)
</script>
