<template>
  <div
    v-show="show"
    role="alert"
    class="alert shadow-lg"
    :class="{
      'alert-success': type === 'success',
      'alert-error': type === 'error',
      'alert-warning': type === 'warning',
      'alert-info': type === 'info'
    }"
  >
    <div class="flex items-start gap-2">
      <div class="inline-block pt-1">
        <icon :name="icon" class="inline-block cursor-pointer pt-1 text-xl"></icon>
      </div>
      <div class="max-w-80 pt-1">
        <h3 class="font-bold">{{ title }}</h3>
        <div class="text-base">{{ message }}</div>
      </div>
    </div>
    <div class="flex-none">
      <button type="button" class="btn btn-ghost btn-sm" @click="show = false">
        <icon name="close" class="cursor-pointer"></icon>
      </button>
    </div>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps<{
  message: string
  title: string
  type?: 'success' | 'error' | 'warning' | 'info'
}>()
const show = ref(true)
const icon = computed(() => {
  switch (props.type) {
    case 'success':
      return 'ic:outline-check'
    case 'error':
      return 'ic:outline-error-outline'
    case 'warning':
      return 'ic:outline-warning'
    default:
      return 'ic:outline-info'
  }
})
</script>
