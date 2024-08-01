<template>
  <address-card class="cart-address-delivery" :address="deliveryAddress">
    <template #header>
      <slot name="header" :address="deliveryAddress">
        <h2 class="title">
          <icon name="shipping"></icon>
          <template v-if="cart?.hasSameAddress()">
            {{ $t('cart.address.same-address.title') }}
          </template>
          <template v-else>
            {{ $t('cart.address.shipping.title') }}
          </template>
        </h2>
        <div class="subtitle">
          {{ deliveryAddress?.name }}
        </div>
      </slot>
    </template>
    <template v-if="!deliveryAddress?.id" #body>
      <div class="cart-address-delivery__error">
        {{ $t('cart.address.no-address') }}
      </div>
    </template>
    <template v-if="editable" #footer>
      <div v-if="cart?.hasSameAddress()" class="cart-address-delivery__same-address">
        {{ $t('cart.address.same-address.label') }}
      </div>
      <div class="cart-address-delivery__footer">
        <div class="address-selector">
          <slot name="action" on-open>
            <button type="button" class="btn btn-primary btn-outline btn-sm" @click="onOpen">
              <span class="pl-1">
                {{ $t('cart.address.select') }}
              </span>
            </button>
          </slot>
          <aside-drawer
            :open="opened"
            @close="onClose"
            class-content="cart-address-delivery__aside"
          >
            <template #header>
              <div class="aside__header">
                {{ $t('cart.address.shipping.title') }}
              </div>
            </template>
            <template #content>
              <address-list type="delivery" class="cart-address-selector">
                <template #address-footer="{ address }">
                  <div class="aside__button">
                    <button
                      type="button"
                      class="btn btn-primary btn-sm"
                      @click="onUpdateAddress(address)"
                    >
                      {{ $t('cart.address.pick') }}
                      <icon name="right"></icon>
                    </button>
                  </div>
                </template>
              </address-list>
            </template>
          </aside-drawer>
        </div>
      </div>

      <slot name="footer" :address="deliveryAddress">
      </slot>
    </template>
  </address-card>
</template>
<script lang="ts">
import { AddressList } from '#components'
import type { Address } from '#models'

export default defineNuxtComponent({
  events: ['close', 'open'],
  name: 'cart-delivery-address',
  components: {
    'address-list': AddressList
  },
  props: {
    editable: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  setup(_props) {
    const opened = ref(false)
    const cartService = useShopinvaderService('cart')
    const cart = cartService?.getCart()
    const deliveryAddress = computed(() => {
      return cart.value?.delivery?.address || null
    })

    return {
      deliveryAddress,
      opened,
      cart
    }
  },
  methods: {
    async onUpdateAddress(address: Address | null) {
      if (!address) return null
      const cartService = useShopinvaderService('cart')
      await cartService.setAddress('delivery', address)
      this.onClose()
    },
    onClose() {
      this.opened = false
      this.$emit('close')
    },
    onOpen() {
      this.opened = true
      this.$emit('open')
    }
  },
  watch: {
    value(val) {
      this.$emit('select', val)
    }
  }
})
</script>
<style lang="scss">
.cart-address-delivery {
  &__same-address {
    @apply text-right text-sm text-gray-500 pt-4 pb-2;
  }
  &__footer {
    @apply flex justify-end gap-4;
  }
  &__error {
    @apply h-full py-8 text-center text-error;
  }
  &__aside {
    .cart-address-selector {
      @apply w-full;
      .content__items {
        @apply flex flex-col items-stretch gap-4;
        .address-card {
          &__footer {
            @apply flex justify-end;
          }
        }
      }
    }
  }
}
</style>
