<template>
  <div v-if="!user" class="checkout-login">
    <account-login class="cart-login__form" @success="next"> </account-login>
  </div>
</template>
<script lang="ts">
import AccountLogin from '~/components/account/AccountLogin.vue'
export default defineNuxtComponent({
  name: 'CheckoutLogin',
  emits: ['next', 'back'],
  components: {
    'account-login': AccountLogin
  },
  setup(props, { emit }) {
    const auth = useAuth()
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
