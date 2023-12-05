<template>
  <div class="line">
    <div class="line__image">
      <slot
        v-if="line?.product?.images"
        name="image"
        :images="line.product?.images || null"
      >
        <product-image
          v-if="line?.product?.images?.length > 0"
          :image="line?.product.images[0]"
          class="product-hit__image"
          @click="linkToProduct()"
        >
        </product-image>
      </slot>
    </div>
    <div class="line__content">
      <div class="content__text">
        <div class="content__header">
          <slot name="header" :line="line"> {{ line.name }}</slot>
        </div>
        <div class="content__content">
          <slot name="content" :line="line">
            <div v-if="line?.product?.urlKey">
              <nuxt-link
                :to="localePath({path:`/${line.product.urlKey}`})"
                target="_blank"
              >
                {{ $t('sale.product_link') }}
              </nuxt-link>
            </div>
          </slot>
        </div>
        <div class="content__qty">
          <slot name="qty" :line="line">
            {{ $t('sale.quantity', {qty:line.qty}) }}
          </slot>
        </div>
      </div>
      <div class="content__price">
        <slot name="price" :line="line">
          {{ $t('sale.price', { price: $filter.currency(line.amount.price)}) }}
        </slot>
      </div>
      <div class="content__actions">
        <slot name="actions" :line="line">
        </slot>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import type { PropType } from 'vue'
import { SaleLine } from '#models'

export default defineNuxtComponent({
  name: 'OrderInvoiceLine',
  props: {
    line: {
      type: Object as PropType<SaleLine>,
      required: true
    }
  },
  setup(props) {
    const localePath = useLocalePath()
    return {
      localePath
    }
  }
})
</script>
<style lang="scss">
.line {
  @apply  flex flex-wrap items-center rounded-lg border-2 p-3;
  &__image {
    @apply w-full px-4 lg:mb-0 lg:w-24 lg:h-24 bg-base-100;
  }
  &__content {
    @apply flex flex-grow w-full justify-between px-4 lg:w-9/12;
    .content {
      &__text {
        @apply flex flex-col flex-grow;
      }
      &__header {
        @apply  font-heading;
      }
      &__title {
        .title {
          @apply flex-grow  text-gray-500;
        }
      }
      &__qty {
        @apply text-gray-500;
      }
      &__price {
        @apply flex flex-row p-2;
        .price {
          &__value {
            @apply text-2xl font-bold text-success;
          }
          &__tax {
            @apply text-xs font-normal text-gray-500;
          }
          &__original {
            @apply text-sm font-normal text-gray-500 line-through;
          }
        }
      }
      &__actions {
        @apply flex flex-row p-2 items-end justify-between md:items-center;
      }
    }
  }
}
</style>
