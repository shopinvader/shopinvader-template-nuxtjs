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
<style>
@reference "@/assets/css/main.css";

.account-link {
  @apply card card-body flex w-auto cursor-pointer flex-row  items-center bg-base-100 p-5 sm:flex-col sm:justify-center;
  &__icon {
    .icon {
      @apply text-lg text-primary sm:text-4xl md:text-5xl;
    }
  }
  &__content {
    @apply pt-2 text-sm sm:text-center sm:text-lg sm:font-semibold;
  }
}
</style>
