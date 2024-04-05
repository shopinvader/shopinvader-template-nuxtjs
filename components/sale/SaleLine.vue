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
          <slot name="header" :line="line">
            {{ line?.product?.model?.name || line.name }}
            <div v-if="line?.product?.name" class="header__subtitle">
              {{ line?.product?.shortName }}
            </div>
          </slot>
        </div>
        <div class="content__content">
          <slot name="content" :line="line">
            <div v-if="line?.product?.urlKey">
              <nuxt-link
                :to="localePath({path:`/${line.product.urlKey}`})"
                target="_blank"
                class="underline"
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
          <div class="value">
            <div
              v-if="line.amount.discountTotal !== 0"
              class="price__original"
            >
              {{ $filter.currency(line.amount.totalWithoutDiscount) }}
            </div>
            <div class="price__value">
              {{ $filter.currency(line.amount.total) }}
            </div>
          </div>
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
  name: 'SaleLine',
  props: {
    line: {
      type: Object as PropType<SaleLine>,
      required: true
    }
  },

  setup(props) {
    const toggle = ref(false)
    const localePath = useLocalePath()
    return {
      localePath,
      toggle
    }
  }
})
</script>
<style lang="scss">
.line {
  @apply  flex flex-wrap items-start md:items-center rounded-lg border-2 p-3;
  &__image {
    @apply px-4 lg:mb-0 w-16 h-16 lg:w-24 lg:h-24 bg-base-100 flex justify-center items-center;
  }
  &__content {
    @apply flex flex-grow w-9/12 justify-between px-4 lg:w-9/12;
    .content {
      &__text {
        @apply flex flex-col flex-grow;
      }
      &__header {
        @apply  font-heading;
        .header__subtitle {
          @apply text-gray-500 text-xs italic;
        }
      }
      &__title {
        .title {
          @apply flex-grow  text-gray-500;
        }
      }
      &__content {
        @apply pb-3;
      }
      &__qty {
        @apply text-gray-500 text-xs;
      }
      &__price {
        @apply flex flex-row p-2;
        .price {
          &__value {
            @apply text-sm font-normal text-gray-900;
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
