<template>
  <div
    class="product-variant-selector"
    :class="{'product-variant-selector--loading': loading}"
  >
    <div v-if="error" class="product-variant-selector__error">
      <icon name="error" class="text-error"/>
      {{ error }}
    </div>
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
                  'values__btn--selected': value == selectValues[name],
                  'values__btn--unselected':  value != selectValues[name]
                }"
                @click="selectVariant(name, value)"
              >
                {{ value }}
              </button>
            </div>
          </template>
          <select v-else
            class="values__select"
            v-model="selectValues[name]"
            @change="changeVariant"
          >
            <option
              v-for="value of axis"
              :key="value"
              :value="value"
            >
              {{ value }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Product, type VariantAttributes } from '~/models'

const props = defineProps({
  product: {
    type: Object as PropType<Product>,
    required: true
  }
})
const { t } = useI18n()
const loading = ref(true)
const error = ref(null) as Ref<string | null>

let variantAxes = ref({}) as Ref<VariantAttributes>
let selectValues = reactive({...props.product.variantAttributes})
const emit = defineEmits(['selectVariant'])
const findProduct = async (variantAttributes: VariantAttributes):Promise<{
  axes: any;
  product: Product | null;
}> => {
  let axes = []
  let product = null
  let data = null
  try {
    loading.value = true
    const productService = useShopinvaderService('products')
    data = await productService.getVariantsAggregation(
      props.product.urlKey || '', variantAttributes
    )
    axes = data?.axes
    product = data?.product
    if (!product) {
      /* if the current selection does not exists */
      let haschange = false
      for(let [key, value] of Object.entries(variantAttributes)) {
        if(!axes?.[key]?.includes(value)) {
          variantAttributes[key] = axes[key][0]
          haschange = true
        }
      }
      if(haschange) {
        data = await findProduct(variantAttributes)
        axes = data?.axes
        product = data?.product
      }
    }
  } catch (err) {
    console.error('Error while fetching variant axes', err)
    error.value = t('error.generic')
    variantAxes.value = {}
  } finally {
    loading.value = false
    return {
      axes,
      product
    }
  }
}

const changeVariant = async (value:any) => {
  const { product, axes } = await findProduct(selectValues)
  variantAxes.value = axes
  if (product) {
    emit('selectVariant', product)
  }
}

const selectVariant = async (name:string, value:any) => {
  selectValues[name] = value
  changeVariant(value)
}

try {

  const productService = useShopinvaderService('products')
  if(props.product && props.product?.urlKey) {
    const { urlKey, variantAttributes } = props.product
    const result = await productService.getVariantsAggregation(urlKey, variantAttributes)
    variantAxes.value = result.axes
  }
} catch (err) {
  console.error('Error while fetching variant axes', err)
  error.value = t('error.generic')
} finally {
  loading.value = false
}

</script>
<style lang="scss">
.product-variant-selector {
  @apply min-h-16 transition-all duration-300 ease-in-out;
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
  &__error {
    @apply flex gap-1 alert;
  }
}
</style>
