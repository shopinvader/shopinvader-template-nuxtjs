<template >
  <div class="dropdown">
    <label tabindex="0" class="btn m-1">Language
    <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
    <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
    </label>
  <ul
    v-if="availableLocales.length"
    class="dropdown-content menu menu-compact p-2  bg-base-100 rounded-box">
    
    <li
      
      v-for="locale in availableLocales" :key="locale.code"
    >
      <nuxt-link
        :key="locale.code"
        :to="switchLocalePath(locale.code)"
      >
        {{ $t('localeswitcher.'+locale.code) }}
      </nuxt-link>
    </li>
  </ul>
  </div>
</template>
<script setup>
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const availableLocales = computed(() => {
  return (locales.value)
})
const currentLocale = computed(() => {
  return locale.value
})
</script>
<style lang="scss">
.localeswitcher {
  display: flex;
  .localeswitcher-item {
    @apply border-r px-2;
    &:last-child {
      @apply border-r-0;
    }
    &--active {
      @apply font-bold;
    }
  }
}
</style>

