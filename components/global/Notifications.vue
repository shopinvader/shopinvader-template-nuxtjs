<template>
  <div class="toast" :class="[classPositionX, classPositionY]">
    <toast
      v-for="notification in notifications"
      :key="notification.message"
      :message="notification.message"
      :type="notification.type"
      :title="notification.title || ''"
    >
    </toast>
  </div>
</template>
<script lang="ts" setup>
const appConfig = useAppConfig()
const classPositionX = ref('toast-end')
const classPositionY = ref('toast-bottom')
classPositionX.value = 'toast-' + (appConfig?.notifications?.position?.x || 'end')
classPositionY.value = 'toast-' + (appConfig?.notifications?.position?.y || 'bottom')
const notifications = computed(() => {
  const notifications = useNotification()
  return notifications.messages
})
</script>
<style lang="scss">
.toast {
  @apply whitespace-normal;
  .alert {
    @apply items-start;
  }
}
</style>
