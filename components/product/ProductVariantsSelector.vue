<template>
  <div
    class="product-variant-selector"
    :class="{'product-variant-selector--loading': loading}"
  >
    <div class="product-variant-selector__axis">
      <div
        v-for="(axis, name) of variantAxes"
        :key="name"
        class="variant-axis">
        <div class="variant-axis__name">
          {{ name }}
        </div>
        <div class="variant-axis__values">
          <template v-if="axis?.length < 6">
            <div v-for="value in axis" :key="value">
              <button
                type="button"
                class="values__btn"
                :class="{
                  'values__btn--selected': value?.toLowerCase() == product.variantAttributes[name]?.toLowerCase(),
                  'values__btn--unselected':  value?.toLowerCase() != product.variantAttributes[name]?.toLowerCase()
                }"
                @click="select(name, value)"
              >
                {{ value }}
              </button>
            </div>
          </template>
          <select v-else class="values__select">
            <option
              v-for="value of axis"
              :key="value"
              :value="value"
              :selected="value == product.variantAttributes[name]"
              @click="select(name, value)"
            >
              {{ value }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Product, type VariantAttributes } from '~/models'

export default defineNuxtComponent({
  emits: ['selectVariant'],
  props: {
    product: {
      type: Object as PropType<Product>,
      required: true
    }
  },
  async setup(props) {
    const loading = ref(true)
    const productService = useShopinvaderService('products')
    const { product } = props
    let variantAxes = []
    if(product && product?.urlKey) {
      const { urlKey, variantAttributes } = product
      const result = await productService.getVariantsAggregation(urlKey, variantAttributes)
      variantAxes = result.axes
    }
    loading.value = false
    return {
      variantAxes,
      loading
    }
  },
  methods: {
    async select(name:string, axis: string) {
      const variantAttributes = {...this.product.variantAttributes}
      variantAttributes[name] = axis
      this.findProduct(variantAttributes)
    },
    async findProduct(variantAttributes: VariantAttributes) {
      this.loading = true
      const productService = useShopinvaderService('products')
      const { product, axes } = await productService.getVariantsAggregation(this.product.urlKey || '', variantAttributes)
      this.variantAxes = axes
      if (product) {
        this.$emit('selectVariant', product)
      } else {
        /* if the current selection does not exists */
        let haschange = false
        for(let [key, value] of Object.entries(variantAttributes)) {
          if(!axes?.[key]?.includes(value)) {
            variantAttributes[key] = axes[key][0]
            haschange = true
          }
        }
        if(haschange) {
          this.findProduct(variantAttributes)
        }
      }
      this.loading = false
    }
  }
})
</script>
<style lang="scss">
.product-variant-selector {
  &--loading {
    @apply opacity-50;
  }
  &__axis {
    @apply flex flex-col gap-3 py-4;
    .variant-axis {
      &__name {
        @apply font-bold;
      }
      &__values {
        @apply flex flex-wrap gap-1;
        .values {
          &__btn {
            @apply btn btn-xs;
            &--unselected {
              @apply btn-outline;
            }
            &--selected {
              @apply btn-primary text-primary-content;
            }
          }
          &__select {
            @apply  select select-bordered select-sm max-w-xs;
          }
        }
      }
    }
  }
}
</style>
