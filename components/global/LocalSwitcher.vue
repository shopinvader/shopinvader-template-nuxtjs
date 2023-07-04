<template>
  <div class="localeposition dropdown">
    <label tabindex="0" class="m-1">
      <span class="font-semibold uppercase">{{ currentLocale }}</span>
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
        <a :key="item.code" :href="switchLocalePath(item.code)">
          {{ item.name }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup>
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const currentLocale = computed(() => {
  return locale.value
})
const availableLocales = computed(() => {
  return locales.value.filter((i) => i.code !== locale.value)
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
