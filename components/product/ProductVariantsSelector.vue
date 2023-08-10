<template>
  <div class="product-variant-selector">
    <div class="product-variant-selector__axis">
      <div
        v-for="(axis, name) of variantAxes"
        :key="name"
        class="variant-axis">
        <div class="variant-axis__name">
          {{ name }}
        </div>
        <div class="variant-axis__values">
          <template v-if="axis?.length < 10">
            <div v-for="value in axis" :key="value">
              <button
                type="button"
                class="values__btn"
                :class="{
                  'values__btn--selected': value == product.variantAttributes[name],
                  'values__btn--unselected':  value != product.variantAttributes[name]
                }"
                @click="select(name, value)"
              >
                {{ value }}
              </button>
            </div>
          </template>
          <select v-else class="select select-sm max-w-xs">
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
import { Product } from '~/models'

export default defineNuxtComponent({
  emits: ['selectVariant'],
  props: {
    product: {
      type: Object as PropType<Product>,
      required: true
    }
  },
  async setup(props) {
    const productService = useShopinvaderService('products')
    const { product } = props
    let variantAxes = []
    if(product && product?.urlKey) {
      variantAxes = await productService.getVariantsAggregation(product.urlKey, Object.keys(product.variantAttributes))
    }
    return {
      variantAxes
    }
  },
  methods: {
    async select(name:string, axis: string) {
      const axes = {...this.product.variantAttributes}
      axes[name] = axis
      const productService = useShopinvaderService('products')
      const product = await productService.getByURLKeyVariantAxis(this.product.urlKey || '', axes)
      if (product) {
        this.$emit('selectVariant', product)
      }
    }
  }
})
</script>
<style lang="scss">
.product-variant-selector {
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

        }
      }
    }
  }
}
</style>
