<template>
  <ul
    v-if="availableLocales.length"
    class="localeswitcher">
    
    <li
      class="localeswitcher-item"
      :class="{'localeswitcher-item--active': locale.code === currentLocale}"
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

