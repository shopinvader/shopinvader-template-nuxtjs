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
.message-wrapper {
  @apply w-full text-xs;
  &__content {
    @apply flex justify-between items-center rounded border border-info p-4 transition-all duration-300 ease-in-out hover:border-primary hover:shadow-md;

    .message-icon {
      @apply text-info flex-none mr-1;

    }
    .message-text {
      @apply grow;
    }
  }
}
</style>
