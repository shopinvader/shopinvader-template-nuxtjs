<template>
  <ul v-if="availableLocales.length" class="localeswitcher">
    <li
      v-for="item in availableLocales"
      :key="item.code"
      class="localeswitcher-item"
      :class="{ 'localeswitcher-item--active': item.code === currentLocale }"
    >
      <nuxt-link :key="item.code" :to="switchLocalePath(item.code)">
        {{ $t('localeswitcher.' + item.code) }}
      </nuxt-link>
    </li>
  </ul>
</template>
<script setup>
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const availableLocales = computed(() => {
  return locales.value
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
