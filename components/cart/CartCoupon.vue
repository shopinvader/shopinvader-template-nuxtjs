<template>
  <div class="cart-coupon">
    <label class="form-control w-full">
      <div class="label">
        <span class="label-text">
          {{ $t('cart.coupon.title') }}
        </span>
      </div>
      <div class="join gap-4">
        <input
          type="text"
          :placeholder="$t('cart.coupon.title')"
          class="input input-bordered w-full"
          :class="{
            'input-success': success,
            'input-error': error
          }"
          v-model="couponCode"
        />
        <button
          type="button"
          class="btn  btn-outline"
          @click="applyCoupon"
          :title="$t('cart.coupon.apply')"
        >
          <icon name="check"></icon>
        </button>
      </div>
      <div class="label">
        <span v-if="error" class="label-text text-error">
          {{ error }}
        </span>
        <span v-else-if="success" class="label-text text-success">
          {{ $t('cart.coupon.success') }}
        </span>
      </div>
    </label>
  </div>
</template>
<script lang="ts" setup>
const { t } = useI18n()
const notification = useNotification()
const cartService = useShopinvaderService("cart")
const couponCode = ref("")
const success = ref(false)
const error = ref(null) as Ref<string | null>
const applyCoupon = async () => {
  error.value = null
  try {
    if(!couponCode.value) {
      return
    }
    await cartService.applyCoupon(couponCode.value)
    success.value = true
    notification.addMessage(t('cart.coupon.success'))
  } catch (e) {
    error.value = t('cart.coupon.error')
    notification.addError(t('cart.coupon.error'))
  }
}
</script>

<style lang="scss">
.cart-coupon {
  @apply px-6 py-3 bg-gray-100;
}

</style>
