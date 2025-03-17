<template>
  <div class="product-variant-selector" :class="{ 'product-variant-selector--loading': loading }">
    <div v-if="error" class="product-variant-selector__error">
      <icon name="error" class="text-error" />
      {{ error }}
    </div>
    <div v-else class="product-variant-selector__axis">
      <label v-for="(values, name) of variantAttributes" :key="name" class="variant-axis">
        <div class="variant-axis__name">
          <slot name="axis-name" :axis="name" :values="values">
            {{ name }}
          </slot>
        </div>
        <div class="variant-axis__values">
          <slot
            name="axis-values"
            :axis="name"
            :values="values"
            :on-select-variant="onSelectVariant"
          >
            <template v-if="values?.length < 6">
              <div v-for="value in values" :key="value.value">
                <button
                  type="button"
                  class="values__btn"
                  :class="{
                    'values__btn--selected': value.selected,
                    'values__btn--unselected': !value.selected
                  }"
                  @click="onSelectVariant(name, value)"
                  :disabled="!value.variant"
                >
                  {{ value.value }}
                </button>
              </div>
            </template>
            <select
              v-else
              class="values__select"
              v-model="selectValues[name]"
              @change="
                () => onSelectVariant(name, values.find((v) => v.value === selectValues[name])!)
              "
            >
              <option
                v-for="value of values"
                :key="value.value"
                :value="value.value"
                :disabled="!value.variant"
              >
                {{ value.value }}
              </option>
            </select>
          </slot>
        </div>
      </label>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { Product, VariantAttributes } from '#models'
import isEqual from '~/utils/IsEqual'
interface VariantAttributeOptions {
  [key: string]: (string | number)[]
}
export interface VariantAttributeSelector {
  [key: string]: VariantAttributeSelectorItem[]
}
export interface VariantAttributeSelectorItem {
  key: string
  value: string | number
  selected: boolean
  variant: Product | null
}
const props = defineProps({
  product: {
    type: Object as PropType<Product>,
    required: true
  }
})
const emit = defineEmits(['selectVariant'])

const { t } = useI18n()
const products = ref<Product[]>([])
const selectValues = ref({ ...props.product.variantAttributes })
const selectedVariant = ref(props.product)
const productService = useShopinvaderService('products')
const error = ref<string | null>(null)
const loading = ref(true)

/** computeds */
const filterByKeys = (obj: any, keys: string[]) => {
  return Object.fromEntries(Object.entries(obj).filter(([key]) => keys.includes(key)))
}

const variantOptions = computed((): VariantAttributeOptions => {
  return products.value.reduce((acc, item) => {
    for (const axe in item.variantAttributes) {
      const value = item.variantAttributes[axe]
      if (!acc?.[axe]) {
        acc[axe] = []
      }
      if (!acc[axe].includes(value)) {
        acc[axe].push(value)
      }
    }
    return acc
  }, {} as VariantAttributeOptions)
})

const variantAttributes = computed((): VariantAttributeSelector => {
  const product: Product | null = selectedVariant.value || null

  const attributes: VariantAttributeSelector = {}
  if (!product) return attributes
  const variantOptionsEntries = Object.entries(variantOptions.value)
  const keys: string[] = []
  /** Loop on attribute type (ex color, size...) */
  for (const index in variantOptionsEntries) {
    const [key, values] = variantOptionsEntries[index]
    keys.push(key)
    /** Loop on attribute values (ex blue, white, red...) */
    for (const value of values) {
      const searchedVariant = filterByKeys(product.variantAttributes, keys)
      const filteredVariant: Product[] | null =
        products.value.filter((v) =>
          isEqual(filterByKeys(v.variantAttributes, keys), {
            ...searchedVariant,
            [key]: value
          })
        ) || []
      const variant =
        filteredVariant?.find((v) => v.variantAttributes[key] === value) ||
        filteredVariant?.[0] ||
        null

      if (!attributes[key]) {
        attributes[key] = []
      }
      attributes[key].push({
        key,
        value,
        selected: searchedVariant[key] === value,
        variant
      })
    }
  }
  return attributes
})

/** Methods */

const getVariants = async (product: Product): Promise<Product[]> => {
  try {
    loading.value = true
    const { urlKey, variantCount } = product
    return (await productService.getVariantsByURLKey(urlKey || '', variantCount)) || []
  } catch (err) {
    console.error('Error while fetching variant axes', err)
    error.value = t('error.generic')
    return []
  } finally {
    loading.value = false
  }
}

const onSelectVariant = async (name: string | number, value: VariantAttributeSelectorItem) => {
  selectValues.value = value.variant?.variantAttributes || {}
  changeVariant(value)
}

const changeVariant = async ({ variant }: VariantAttributeSelectorItem) => {
  if (variant) {
    variant.variants = products.value.filter((v) => v.id === variant.id)
    selectedVariant.value = variant
    setTimeout(() => {
      emit('selectVariant', variant)
    }, 100)
  }
}

products.value = await getVariants(props.product)

/** Watcher */
watch(props.product, async (product, oldProduct) => {
  if (product.urlKey !== oldProduct.urlKey) {
    products.value = await getVariants(product)
  }
  if (selectedVariant.value.id !== product.id) {
    selectedVariant.value = product
    selectValues.value = { ...product.variantAttributes }
  }
})
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
            @apply select select-bordered select-sm max-w-xs;
          }
        }
      }
    }
  }
  &__error {
    @apply alert flex gap-1;
  }
}
</style>
