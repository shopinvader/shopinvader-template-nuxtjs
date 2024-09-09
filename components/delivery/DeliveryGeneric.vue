<template>
  <div
    class="method"
    :class="{
      'method--selected': selected
    }"
    @click="$emit('select', deliveryCarrier)"
  >
    <div class="method__icon">
      <icon name="solar:box-line-duotone" />
    </div>
    <div class="method__body">
      <div class="body__title">
        <slot name="title" :delivery-carrier="deliveryCarrier">
          {{ deliveryCarrier.name }}
        </slot>
      </div>
      <div class="body__description">
        <slot name="description" :delivery-carrier="deliveryCarrier">
          {{ deliveryCarrier.description }}
        </slot>
      </div>
      <slot name="error" :error="error">
        <div v-if="selected && error" class="body__error">
          {{ $t('error.generic') }}
        </div>
      </slot>
      <slot name="dropoff" :delivery-carrier="deliveryCarrier" :on-select-pickup="selectPickup" :on-search-pickup="onSearchPickupPoint">
        <div v-if="deliveryCarrier?.withDropoffSite && selected" class="body__dropoff">
          <div class="dropoff">
            <div class="dropoff__title">
              {{ $t('cart.delivery.method.pickup.intro') }}
            </div>
            <label class="dropoff__search">
              <div class="search__label">
                {{ $t('cart.delivery.method.pickup.search') }}
              </div>
              <input type="text" class="search__input" v-model="searchedName" />
            </label>
            <ul v-if="dropoffSites?.length > 0" class="dropoff__list">
              <li v-for="dropoff in dropoffSites" :key="dropoff.id">
                <label>
                  <input type="radio" :name='`dropoffsite-${deliveryCarrier.id}`' :value="dropoff.id" @change="selectPickup" />
                  {{ dropoff.name }}
                </label>
              </li>
            </ul>
            <div v-if="dropoffSites?.length === 0">
              {{ $t('cart.delivery.method.pickup.no-result') }}
            </div>
          </div>
        </div>
      </slot>
    </div>
    <div class="method__price">
      <template v-if="deliveryCarrier?.price && deliveryCarrier?.price > 0">
        {{ $filter.currency(deliveryCarrier.price) }}
      </template>
      <template v-else>
        {{ $t('cart.delivery.method.free') }}
      </template>
    </div>
  </div>
</template>
<script lang="ts">
import type { PropType } from 'vue'
import { DeliveryCarrier, DeliveryPickupPoint } from '#models'

export default {
  name: 'DeliveryGeneric',
  props: {
    deliveryCarrier: {
      type: Object as PropType<DeliveryCarrier>,
      required: true
    },
    selected: {
      type: Boolean,
      required: false
    }
  },
  emits: ['select'],
  setup(props) {
    const error = ref(false)
    const searchedName = ref<string | null>(null)
    const cartService = useShopinvaderService('cart')
    const carrierService = useShopinvaderService("deliveryCarriers")
    const dropoffSites = ref([] as DeliveryPickupPoint[])

    const onSearchPickupPoint = async () => {
      try {
        error.value = false
        dropoffSites.value = []
        dropoffSites.value = await carrierService?.getDeliveryPickups(props.deliveryCarrier.id, searchedName.value || '')
      } catch(e) {
        console.error(e)
        error.value = true
      }
    }

    watch(() => props.selected, async() => {
      await onSearchPickupPoint()
    })

    watch(() => searchedName.value, async() => {
      await onSearchPickupPoint()
    })

    const selectPickup = async (dropoff: DeliveryPickupPoint) => {
      try {
        error.value = false
        await cartService.setPickupPoint(dropoff)
      } catch(e) {
        console.error(e)
        error.value = true
      }
    }
    return {
      dropoffSites,
      searchedName,
      onSearchPickupPoint,
      selectPickup,
      error
    }
  }
}
</script>
<style lang="scss">
.method {
  @apply flex w-full cursor-pointer gap-2 rounded border p-4 transition-all duration-300 ease-in-out hover:border-primary hover:shadow-md;
  &--selected {
    @apply border-2 border-primary shadow-lg;
  }
  &__icon {
    @apply text-5xl text-primary;
  }
  &__body {
    @apply w-full flex-grow;
    .body {
      &__title {
        @apply flex items-center justify-start font-bold;
      }
      &__description {
        @apply text-gray-500;
      }
      &__error {
        @apply text-error;
      }
      &__dropoff {
        @apply flex items-center gap-2 text-sm text-gray-500;
        .dropoff {
          @apply w-full flex flex-col gap-1 border-t pt-2 mt-2;
          &__title {
            @apply font-bold;
          }
          &__search {
            @apply form-control w-full max-w-xs;
            .search {
              &__label {
                @apply label;
              }
              &__input {
                @apply input input-sm input-bordered w-full max-w-xs;
              }
            }
          }
        }
      }
    }
  }
  &__price {
    @apply flex text-right justify-end font-bold text-primary;
  }
}
</style>
