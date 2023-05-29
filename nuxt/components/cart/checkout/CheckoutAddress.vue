<template>
  <div
    v-if="cart && user"
    class="checkout-address"
    :class="{ 'checkout-address--active': active }"
  >
    <div v-if="error" class="alert alert-error mb-6">
      <div>
        <icon icon="ph:warning-circle" class="text-xl"></icon>
        <span>{{ error }}</span>
      </div>
    </div>
    <div class="checkout-address__items">
      <address-card
        v-for="item in types"
        :key="item.type"
        :address="item.address"
        class="address"
      >
        <template #header>
          <h2 class="title">
            <icon :icon="item.icon"></icon>
            {{ $t('cart.address.' + item.type + '.title') }}
          </h2>
          <div class="subtitle">
            {{ item.address?.name }}
          </div>
        </template>
        <template v-if="!item?.address?.id" #body>
          <div class="h-full py-8 text-center text-error">
            {{ $t('cart.address.no-address') }}
          </div>
        </template>
        <template v-if="active" #footer>
          <div class="flex justify-end gap-4">
            <button
              type="button"
              class="btn-outline btn-primary btn"
              :disabled="loading"
              @click="selectedAddressType = item.type"
            >
              <icon icon="mdi:edit"></icon>
              <span class="pl-1">{{ $t('cart.address.select') }}</span>
            </button>
          </div>
        </template>
      </address-card>
    </div>
    <div v-if="active" class="checkout-address__submit">
      <button
        class="btn-secondary btn px-10"
        :class="{ loading: loading }"
        type="submit"
        @click="submit"
      >
        {{ $t('cart.address.continue') }}
        <icon icon="material-symbols:chevron-right" class="text-lg"></icon>
      </button>
    </div>
  </div>
  <aside-drawer
    :open="selectedAddressType !== null"
    @close="selectedAddressType = null"
  >
    <template #header>
      <div class="text-2xl">
        {{ $t('cart.address.' + selectedAddressType + '.title') }}
      </div>
    </template>
    <template #content>
      <cart-address-selector
        v-if="selectedAddressType !== null"
        class="cart-address-selector"
        :types="selectedAddressType"
        :selected-address="selectedAddress"
        @select="selectedAddressType = $event"
      />
    </template>
    <template #footer>
      <button class="btn-primary btn">
        {{ $t('cart.address.continue') }}
      </button>
    </template>
  </aside-drawer>
</template>
<script lang="ts">
import AddressCard from '~/components/address/AddressCard.vue'
import CartAddressSelector from '~/components/cart/address/CartAddressSelector.vue'
import { Address } from '~/models'
interface AddressType {
  type: 'delivery' | 'invoicing'
  address: Address | null
  icon: string
}
export default defineNuxtComponent({
  name: 'cart-address',
  emits: ['next', 'back'],
  components: {
    'address-card': AddressCard,
    'cart-address-selector': CartAddressSelector
  },
  props: {
    active: {
      type: Boolean,
      required: true
    }
  },
  async setup(props, { emit }) {
    const i18n = useI18n()
    const auth = useAuth()
    const cart = useCart()
    const loading = ref(false)
    const error = ref(null as string | null)
    const deliveryAddress = ref<Address | null>(null)
    const selectedAddressType = ref<'delivery' | 'invoicing' | null>(null)

    /** Set page title */
    useHead({
      title: i18n.t('cart.address.title')
    })

    /** Check if the customer is logged */
    const user = auth?.getUser()

    /** Computed and methods */
    const selectedAddress = computed(() =>
      selectedAddressType.value
        ? cart.value?.[selectedAddressType.value]?.address || null
        : null
    )
    const types: AddressType[] = reactive([
      {
        type: 'delivery',
        address: cart.value?.delivery?.address || null,
        icon: 'ph:house'
      },
      {
        type: 'invoicing',
        address: cart.value?.invoicing?.address || null,
        icon: 'ph:file-text'
      }
    ])
    const submit = () => {
      try {
        loading.value = true
        if (!cart.value) throw new Error('Cart not found')
        const { delivery, invoicing } = cart.value
        if (!delivery?.address?.id || !invoicing?.address?.id) {
          throw new Error(i18n.t('cart.address.no-address'))
        }
        emit('next')
      } catch (e: any) {
        error.value = e?.message || e
        loading.value = false
      } finally {
        loading.value = false
      }
    }

    return {
      selectedAddressType,
      selectedAddress,
      error,
      cart,
      loading,
      types,
      deliveryAddress,
      submit,
      user
    }
  }
})
</script>
<style lang="scss">
.checkout-address {
  @apply flex flex-col gap-6;
  &__items {
    @apply flex w-full flex-row flex-wrap gap-6;
    .address {
      @apply flex-grow rounded-lg bg-slate-50 p-4 text-slate-900 shadow-none;
      .title {
        @apply m-0 flex items-center gap-4 text-xl font-bold uppercase leading-none text-inherit;
      }
      .subtitle {
        @apply ml-4 pt-3;
      }
    }
  }
  &--active {
    .checkout-address__items {
      .address {
        @apply border border-primary text-primary;
      }
    }
  }

  &__submit {
    @apply flex w-full flex-grow justify-end gap-6 py-4;
  }
}
.aside-drawer {
  &__side {
    .cart-address-selector {
      @apply w-full;
      .content__items {
        @apply flex flex-col items-stretch gap-4;
      }
    }
  }
}
</style>
