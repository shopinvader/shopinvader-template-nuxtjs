<template>
  <address-card class="address" :address="invoicingAddress">
    <template #header>
      <h2 class="title">
        <icon name="billing"></icon>
        {{ $t('cart.address.billing.title') }}
      </h2>
      <div class="subtitle">
        {{ invoicingAddress?.name }}
      </div>
    </template>
    <template v-if="editable" #footer>
      <div class="cart-address-invoicing">
        <slot v-if="invoicingAddress" name="action" on-open>
          <div class="cart-address-invoicing__btn">
            <button class="btn" @click="onOpen">
              <icon name="edit"></icon>
              <span class="pl-1">{{ $t('account.address.edit') }}</span>
            </button>
          </div>
        </slot>
        <aside-drawer :open="opened" @close="onClose" class-content="cart-address-invoicing__aside">
          <template #header>
            <div class="aside__header">
              {{ $t('cart.address.billing.title') }}
            </div>
          </template>
          <template #content>
            <div v-if="hasSameAddresses" class="alert-same-address">
              <icon name="warning"></icon>
              <span>
                {{ $t('cart.address.billing.warning_same') }}
              </span>
            </div>
            <address-form
              v-if="model"
              :address="model"
              @submit="(e) => onUpdateAddress(e)"
            ></address-form>
          </template>
        </aside-drawer>
      </div>
    </template>
  </address-card>
</template>
<script lang="ts" setup>
import { Address } from '#models'
const emits = defineEmits(['close', 'open', 'select'])
defineProps({
  editable: {
    type: Boolean,
    required: false,
    default: true
  }
})
const opened = ref(false)
const addressService = useShopinvaderService('addresses')
const cartService = useShopinvaderService('cart')
const cart = cartService?.getCart() || ref(null)
const model = ref(null) as Ref<Address | null>

const invoicingAddress = computed(() => {
  const cartService = useShopinvaderService('cart')
  const cart = cartService.getCart()
  return cart.value?.invoicing?.address || null
})

const hasSameAddresses = computed(
  () => cart?.value?.delivery?.address?.id == invoicingAddress?.value?.id
)

const onClose = () => {
  model.value = null
  opened.value = false
  emits('close')
}

const onUpdateAddress = async (address: Address | null) => {
  if (!address) return null

  const addressSaved = (await addressService?.update(address)) || null

  if (addressSaved) {
    await cartService.setAddress('invoicing', addressSaved)
  }
  onClose()
}

const onOpen = async () => {
  let data = invoicingAddress.value?.data || null
  if (!data) {
    const main = await addressService?.getMainAddress()
    data = main?.data || null
  }
  model.value = new Address({
    ...data,
    type: 'invoicing'
  })
  opened.value = true
  emits('open')
}

watch(
  () => model.value,
  (val) => {
    emits('select', val)
  }
)
</script>
<style>
@reference "@/assets/css/main.css";

.cart-address-invoicing {
  @apply flex w-full justify-end;
  .cart-address-invoicing__btn {
    .btn {
      @apply btn-link;
    }
  }
  &__aside {
    .aside__header {
      @apply font-heading text-2xl;
    }
    .alert-same-address {
      @apply alert alert-warning mb-4 flex items-center gap-4;
      .iconify {
        @apply text-6xl;
      }
    }
  }
}
</style>
