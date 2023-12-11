<template>
  <nuxt-link :to="link" class="account-link">
    <div class="account-link__icon">
      <icon :name="icon" />
    </div>
    <div class="account-link__content">{{ label }}</div>
  </nuxt-link>
</template>
<script lang="ts">
export default {
  name: 'AccountIcon',
  props: {
    icon: {
      required: true,
      type: String
    },
    label: {
      required: false,
      type: String,
      default: ''
    },
    link: {
      required: false,
      type: String,
      default: ''
    }
  }
}
</script>
<style lang="scss">
.account-link {
  @apply flex w-auto cursor-pointer flex-col items-center justify-center rounded-xl bg-base-100 p-5 shadow-xl;
  &__icon {
    @apply my-5 rounded-full bg-primary p-4 text-4xl text-white;
  }
  &__content {
    @apply pt-2 text-center text-lg font-semibold;
  }
}
</style>
