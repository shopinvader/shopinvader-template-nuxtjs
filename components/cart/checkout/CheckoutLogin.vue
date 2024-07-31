<template>
  <div v-show="!user" class="checkout-login">
    <!-- @slot Main content -->
    <slot name="body">
      <account-login class="cart-login__form" @success="success"> </account-login>
    </slot>
  </div>
</template>
<script lang="ts">
import { AccountLogin } from '#components'
import { User } from '~/models';
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
    const success = () => {
      emit('next')
    }
    onMounted(() => {
      if (user?.value) {
        success()
      }
    })
    watch(() => user?.value, (value) => {
      if (value instanceof User) {
        success()
      }
    })
    return {
      user,
      success
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
