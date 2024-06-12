<template>
  <div id="app">
    <div class="login">
      <div class=""></div>
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
  @apply flex min-h-screen flex-col items-center overflow-hidden bg-gradient-to-tr from-gray-400 via-yellow-50 to-gray-400;
  &__container {
    @apply container mx-auto px-4 py-8;
    .container__link {
      @apply btn btn-primary btn-sm mb-4 rounded-full text-white;
    }
  }
}
</style>
