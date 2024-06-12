<template>
  <div v-show="show" class="alert shadow-lg" :class="className">
    <div class="flex items-start gap-1">
      <icon :name="icon" class="cursor-pointer text-xl"></icon>
      <div class="pt-1">
        <h3 class="font-bold">{{ title }}</h3>
        <div class="text-xs">{{ message }}</div>
      </div>
    </div>
    <div class="flex-none">
      <button class="btn btn-ghost btn-sm">
        <icon name="close" class="cursor-pointer" @click="show = false"></icon>
      </button>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  props: {
    message: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: false,
      default: 'info'
    }
  },
  data() {
    return {
      show: true
    }
  },
  computed: {
    className(): string {
      switch (this.type) {
        case 'success':
          return 'alert-success'
        case 'error':
          return 'alert-error'
        case 'warning':
          return 'alert-warning'
        default:
          return 'alert-info'
      }
    },
    icon(): string {
      switch (this.type) {
        case 'success':
          return 'ic:outline-check-circle-outline'
        case 'error':
          return 'ic:outline-error-outline'
        case 'warning':
          return 'ic:outline-warning'
        default:
          return 'ic:outline-info-outline'
      }
    }
  }
}
</script>
