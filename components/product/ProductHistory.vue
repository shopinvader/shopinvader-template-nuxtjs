<template>
  <div v-if="products.length" class="product-history">
    <div class="product-history__header">
      <slot name="header">
        <h2 class="border-b text-xl">{{ $t('product.history.title') }}</h2>
      </slot>
    </div>
    <div class="product-history__list">
      <div v-for="product in products" class="product-history__item" :key="product.id || 0">
        <product-hit :product="product" :readonly="true" :inline="false"> </product-hit>
      </div>
    </div>
    <div class="product-history__footer">
      <slot name="footer">
        <button type="button" class="btn-link text-left text-black" @click="removeAllProducts">
          {{ $t('product.history.clear') }}
        </button>
      </slot>
    </div>
  </div>
</template>
<script lang="ts">
import type { PropType } from 'vue'
import { useHistoryStore } from '~/stores/history'
import ProductHit from './ProductHit.vue'

export default {
  name: 'ProductHistory',
  components: {
    'product-hit': ProductHit
  },
  props: {
    excludedId: {
      type: Array as PropType<number[]>,
      default: () => []
    },
    size: {
      type: Number,
      default: 3
    }
  },
  setup(props, { emit }) {
    const store = useHistoryStore()
    const products = computed(() => {
      return store.getProducts
        .filter((p) => p && p.id && !props.excludedId.includes(p.id))
        .slice(0, props.size)
    })
    const removeAllProducts = () => {
      store.removeAllProducts()
    }
    return {
      removeAllProducts,
      products
    }
  }
}
</script>
<style lang="scss">
.product-history {
  &__list {
    @apply grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6;
  }
  &__footer {
    @apply flex justify-end;
  }
}
</style>
