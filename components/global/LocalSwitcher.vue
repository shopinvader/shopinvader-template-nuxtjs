<template>
  <div class="localeposition dropdown">
    <label tabindex="0" class="m-1"
      >Language
      <svg
        class="fill-current"
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
      >
        <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
      </svg>
    </label>
    <ul
      v-if="availableLocales.length"
      class="dropdown-content menu rounded-box menu-compact bg-base-100 p-2"
    >
      <li v-for="item in availableLocales" :key="item.code">
        <nuxt-link :key="item.code" :to="switchLocalePath(item.code)">
          {{ $t('localeswitcher.' + item.code) }}
        </nuxt-link>
      </li>
    </ul>
  </div>
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
.localeposition {
  display: block ruby;
}
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
