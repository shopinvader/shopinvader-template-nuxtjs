<template>
  <div v-if="!user" class="checkout-login">
    <!-- @slot Main content -->
    <slot name="body">
      <account-login class="cart-login__form" @success="next"> </account-login>
    </slot>
  </div>
</template>
<script lang="ts">
import AccountLogin from '~/components/account/AccountLogin.vue'
/**
 * Checkout Login step.
 * This component is used in the Checkout funnel.
 * Use allow user to loggin.
 */
export default defineNuxtComponent({
  name: 'CheckoutLogin',
  emits: {
    /** Emit to go to the next step */
    next: () => true,
    /** Emit to go back to the previous step */
    back: () => true
  },
  components: {
    'account-login': AccountLogin
  },
  setup(props, { emit }) {
    const auth = useShopinvaderService('auth')
    const user = auth?.getUser()
    if (user?.value) {
      emit('next')
    }
    return {
      user
    }
  },
  methods: {
    next() {
      this.$emit('next')
    }
  }
})
</script>
<style lang="scss">
.checkout-address {
  &__footer {
    @apply flex justify-between;
  }
}
</style>
