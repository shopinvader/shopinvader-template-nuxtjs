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
  @apply flex flex-row w-auto cursor-pointer sm:flex-col items-center  sm:justify-center card card-body bg-base-100 p-5 ;
  &__icon {
    @apply sm:my-5 rounded-full max-sm:text-primary sm:bg-primary sm:p-4 text-lg sm:text-4xl sm:text-white;
  }
  &__content {
    @apply pt-2 text-sm sm:text-center sm:text-lg sm:font-semibold;
  }
}
</style>
