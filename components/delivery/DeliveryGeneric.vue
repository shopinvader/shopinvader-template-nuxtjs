<template>
  <div
    class="method"
    :class="{
      'method--selected': selected
    }"
    @click="emit('select', deliveryCarrier)"
  >
    <div class="method__icon">
      <icon name="carrier" />
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
      <slot
        name="dropoff"
        :delivery-carrier="deliveryCarrier"
        :on-select-pickup="selectPickup"
        :on-search-pickup="onSearchPickupPoint"
      >
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
                  <input
                    type="radio"
                    :name="`dropoffsite-${deliveryCarrier.id}`"
                    :value="dropoff.id"
                    @change="selectPickup"
                  />
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
        {{ formatCurrency(deliveryCarrier.price) }}
      </template>
      <template v-else>
        {{ $t('cart.delivery.method.free') }}
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { type DeliveryPickupPoint, type DeliveryCarrier } from '#models'
import type { PropType } from 'vue'
import { formatCurrency } from '~/utils/StringHelper'

const emit = defineEmits(['select'])
const props = defineProps({
  deliveryCarrier: {
    type: Object as PropType<DeliveryCarrier>,
    required: true
  },
  selected: {
    type: Boolean,
    required: false
  }
})

const error = ref(false)
const searchedName = ref<string | null>(null)
const cartService = useShopinvaderService('cart')
const carrierService = useShopinvaderService('deliveryCarriers')
const dropoffSites = ref([] as DeliveryPickupPoint[])

const onSearchPickupPoint = async () => {
  if (props.deliveryCarrier?.withDropoffSite) {
    try {
      error.value = false
      dropoffSites.value = []
      dropoffSites.value = await carrierService?.getDeliveryPickups(
        props.deliveryCarrier.id,
        searchedName.value || ''
      )
    } catch (e) {
      console.error(e)
      error.value = true
    }
  }
}

watch(
  () => props.selected,
  async () => {
    if (props.deliveryCarrier?.withDropoffSite) {
      await onSearchPickupPoint()
    }
  }
)

watch(
  () => searchedName.value,
  async () => {
    await onSearchPickupPoint()
  }
)

const selectPickup = async (dropoff: DeliveryPickupPoint) => {
  try {
    error.value = false
    await cartService.setPickupPoint(dropoff)
  } catch (e) {
    console.error(e)
    error.value = true
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
    @apply text-primary;
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
          @apply mt-2 flex w-full flex-col gap-1 border-t pt-2;
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
    @apply flex justify-end text-right font-bold text-primary;
  }
}
</style>
