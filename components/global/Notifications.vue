<template>
  <div class="toast-end toast-bottom toast">
    <toast
      v-for="notification in notifications"
      :key="notification.message"
      :message="notification.message"
      :type="notification.type"
      :title="notification.title"
    >
    </toast>
  </div>
</template>
<script lang="ts">
import { defineNuxtComponent } from '#app'
import Toast from './Toast.vue'
export default defineNuxtComponent({
  name: 'AddressCard',
  components: {
    toast: Toast
  },
  computed: {
    notifications() {
      const notifications = useNotification()
      return notifications.messages
    }
  }
})
</script>
