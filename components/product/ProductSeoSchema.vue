<script setup lang="ts">
import type { Product } from '#models'

const props = defineProps({
  product: {
    type: Object as PropType<Product>,
    required: true
  }
})
const localePath = useLocalePath()

const { product } = props
let productSchema = {}
if (product) {
  const productGroupID = product.urlKey
  const image: string = product.images?.map((img: any) => img?.medium?.src || null)[0] || ''
  if (product?.variantCount > 1) {
    const hasVariant: any[] =
      product.variants?.map((variant: any) => ({
        '@type': 'Product',
        productID: variant?.sku,
        sku: variant?.sku,
        name: variant.name,
        description: `${variant.shortDescription} ${product.shortName}`,
        url: withSiteUrl(localePath(`/${variant.urlKey}?sku=${variant.sku}`)),
        image,
        brand: {
          '@type': 'Brand',
          name: variant.brand?.name
        },
        offers: [
          {
            '@type': 'Offer',
            availability: 'https://schema.org/InStock',
            price: variant.price?.data?.default?.value_taxed || 0,
            priceCurrency: 'EUR'
          }
        ]
      })) || []

    productSchema = {
      '@context': 'https://schema.org/',
      '@type': 'ProductGroup',
      productGroupID,
      name: product.model?.name,
      description: product.shortDescription,
      url: withSiteUrl(localePath(`/${product.urlKey}`)),
      image,
      brand: {
        '@type': 'Brand',
        name: product.brand?.name
      },
      hasVariant
    }
  } else {
    productSchema = defineProduct({
      id: product?.id?.toString(),
      sku: product.sku,
      name: product.name,
      url: withSiteUrl(localePath(`/${product.urlKey}`)),
      description: product.shortDescription,
      image,
      brand: {
        '@type': 'Brand',
        name: product?.brand?.name || ''
      },
      offers: [
        {
          '@type': 'Offer',
          availability: 'https://schema.org/InStock',
          price: product.price?.data?.default?.value_taxed || 0,
          priceCurrency: 'EUR'
        }
      ]
    })
  }
}
useSchemaOrg(productSchema)
</script>
