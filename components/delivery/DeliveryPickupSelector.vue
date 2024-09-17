<template>
  <div v-if="carrier?.withDropoffSite" class="delivery-pickup">
    <div v-if="error" class="delivery-pickup__error">
      <icon name="error" />
      {{ t('error.generic') }}
    </div>
    <div class="delivery-pickup__content">
      <div class="content__title">
        {{ t('cart.delivery.method.pickup.intro') }}
      </div>
      <label class="content__search">
        <div class="search__label">
          {{ t('cart.delivery.method.pickup.search') }}
        </div>
        <input type="text" class="search__input" v-model="searchedName" />
      </label>
      <ul v-if="dropoffSites?.length > 0" class="content__list">
        <li v-for="dropoff in dropoffSites" :key="dropoff.id">
          <label class="dropoff">
            <input
              type="radio"
              :name="`dropoffsite-${carrier.id}`"
              :value="dropoff.id"
              @change="selectPickup(dropoff)"
            />
            <div class="dropoff__label">
              <div class="label__title">{{ dropoff.name }}</div>
              <div class="label__address">
                <div>{{ dropoff.street }}</div>
                <div>{{ dropoff.street2 }}</div>
                <div>{{ dropoff.zip }} {{ dropoff.city }}</div>
              </div>
            </div>
          </label>
        </li>
      </ul>
      <div v-else-if="dropoffSites?.length === 0 && !loading" class="content__no-result">
        {{ t('cart.delivery.method.pickup.no-result') }}
      </div>
      <div v-else class="content__loading">
        <spinner />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { DeliveryCarrier, DeliveryPickupPoint } from '#models'

const emit = defineEmits(['select'])
const props = defineProps({
  carrier: {
    type: Object as PropType<DeliveryCarrier>,
    required: true
  }
})
const { t } = useI18n()
const carrierService = useShopinvaderService('deliveryCarriers')
const dropoffSites = ref([] as DeliveryPickupPoint[])
const error = ref(false)
const loading = ref(false)
const searchedName = ref<string | null>(null)
const onSearchPickupPoint = async () => {
  if (props.carrier?.withDropoffSite) {
    try {
      loading.value = true
      error.value = false
      dropoffSites.value = []
      dropoffSites.value =
        (await carrierService?.getDeliveryPickups(props.carrier.id, searchedName.value || '')) || []
    } catch (e) {
      console.error(e)
      error.value = true
    } finally {
      loading.value = false
    }
  }
}
const selectPickup = async (dropoff: DeliveryPickupPoint) => {
  emit('select', dropoff)
}
onMounted(async () => {
  await onSearchPickupPoint()
})
watch(
  () => searchedName.value,
  async () => {
    await onSearchPickupPoint()
  }
)
</script>
<style lang="scss">
.delivery-pickup {
  @apply flex flex-col items-center gap-2 border-t pt-2 text-sm;
  &__error {
    @apply alert flex items-center gap-2;
    .icon {
      @apply text-error;
    }
  }
  &__content {
    @apply flex w-full flex-col;
    .content {
      &__title {
        @apply font-bold;
      }
      &__search {
        .search {
          &__label {
            @apply label;
          }
          &__input {
            @apply input input-sm input-bordered w-full max-w-xs;
          }
        }
      }
      &__no-result {
        @apply py-2;
      }
      &__loading {
        @apply flex justify-center py-2;
      }
      &__list {
        @apply my-3 max-h-64 overflow-auto border px-3;
        .dropoff {
          @apply flex items-start gap-2 border-b py-2;
          input[type='radio'] {
            @apply mt-1 cursor-pointer;
          }
          &__label {
            @apply flex flex-col;
            .label__title {
              @apply font-bold;
            }
            .label__address {
              @apply text-xs;
            }
          }
        }
      }
    }
  }
}
</style>
