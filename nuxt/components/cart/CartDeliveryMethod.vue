<template>
  <div class="cart-delivery">
    <div v-if="carriers === null" class="cart-delivery__loading">
      <spinner-vue></spinner-vue>
    </div>
    <div v-else-if="error" class="alert alert-error">
      {{ $t('error.generic') }}
      <button type="button" class="btn-ghost btn" @click="fetchCarriers">
        {{ $t('error.retry') }}
      </button>
    </div>
    <template v-else>
      {{ selectedCarrier }}
      <div
        v-for="carrier in carriers"
        :key="carrier.id"
        class="cart-delivery__method"
      >
        <div class="method__title">
          <label
            class="label cursor-pointer"
            :title="$t('cart.delivery.method.select')"
          >
            <input
              type="radio"
              name="title"
              class="radio"
              :value="carrier.id"
              :checked="selectedCarrier?.id == carrier?.id"
              @click="selectCarrier(carrier)"
            />
            <span class="label-text pl-2">
              {{ carrier.name }}
            </span>
          </label>
        </div>
        <div class="method__description">
          {{ carrier.description }}
        </div>
        <div class="method__price">
          {{ $filter.currency(carrier.price) }}
        </div>
      </div>
    </template>
  </div>
</template>
<script lang="ts" setup>
import { DeliveryCarrier } from '~/models/DeliveryCarrier'
const services = useShopinvaderServices()
const selectedCarrier = ref(null as DeliveryCarrier | null)
let carriers = ref(null as DeliveryCarrier[] | null)
let error = ref(null as string | null)

const fetchCarriers = async () => {
  try {
    error.value = null
    carriers.value = null
    if (services?.deliveryCarriers) {
      const results = await services.deliveryCarriers.getAll()
      carriers.value = results.carriers || []
    }
  } catch (e) {
    error.value = e?.message || e
  }
}
const selectCarrier = async (carrier: DeliveryCarrier) => {
  try {
    selectedCarrier.value = carrier
  } catch (e) {
    error.value = e?.message || e
  }
}
onMounted(async () => {
  const cart = services?.cart.getCart()

  await fetchCarriers()
  if (cart?.value) {
    selectedCarrier.value = cart.value.delivery.method || null
    if (!selectedCarrier.value) {
      console.log(carriers?.value?.[0])
      //selectCarrier(carriers?.value?.[0])
    }
  }
})
</script>
<style lang="scss">
.cart-delivery {
  @apply flex flex-col justify-start gap-4;
  &__loading {
    @apply flex h-64 items-center justify-center;
  }
  &__method {
    @apply w-full rounded border border-primary p-4 first-letter:bg-white;
    .method {
      &__title {
        @apply flex items-center justify-start font-bold;
      }
      &__description {
        @apply text-gray-500;
      }
      &__price {
        @apply flex w-full justify-end font-bold text-primary;
      }
      &__btn {
        @apply flex w-full justify-end pt-4;
      }
    }
  }
}
</style>
