<template>
  <div class="message-wrapper">
    <div class="message-wrapper__content">
      <slot name="info-message">
        <icon name="info" class="message-icon" />
        <span class="message-text">{{ t('cart.delivery.message-text') }}</span>
      </slot>
      <slot name="message-button"> </slot>
    </div>
  </div>
  <slot name="action" :opened="opened"> </slot>
</template>
<script setup lang="ts">
const { t } = useI18n()
defineProps({
  opened: {
    type: Boolean,
    required: true
  }
})
</script>
<style lang="scss">
.checkout-delivery__message {
  @apply w-full;
  .message-wrapper {
  @apply  text-xs w-full rounded border border-info p-4 transition-all duration-300 ease-in-out hover:border-primary hover:shadow-md;
  &__content {
    @apply flex justify-between items-center p-3;

    .message-icon {
      @apply text-info flex-none mr-1;

    }
    .message-text {
      @apply grow;
    }
  }
}
}

</style>
