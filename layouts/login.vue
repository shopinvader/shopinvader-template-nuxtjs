<template>
  <div id="app">
    <div class="login">
      <div class="login__header">
        <logo></logo>
      </div>
      <div class="login__container">
        <nuxt-link :to="localePath('/')" class="container__link">
          <icon name="left" class="inline"> </icon>
          {{ $t('btn.back_to_homepage') }}
        </nuxt-link>
        <div class="container__body">
          <slot name="body"> </slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
definePageMeta({
  layout: false
})
</script>
<style lang="scss">
.login {
  @apply flex min-h-screen flex-col items-center overflow-hidden bg-gradient-to-tr from-white to-gray-100;
  &__header {
    @apply pt-8;
  }
  &__container {
    @apply container pt-8;
    .container {
      &__link {
        @apply btn-primary btn-sm btn mb-4 rounded-full text-white;
      }
      &__body {
        @apply flex justify-center;
      }
    }
  }
}
</style>
