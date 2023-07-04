<template>
  <div v-if="availableLocales.length > 1" class="localeposition dropdown">
    <label tabindex="0" class="m-1">
      <span class="font-semibold uppercase">
        <icon :icon="currentLocalIcon" class="text-4xl" />
      </span>
      <icon icon="ph:caret-down-light" />
    </label>
    <ul class="dropdown-content menu rounded-box menu-compact bg-base-100 p-2">
      <li v-for="item in availableLocales" :key="item.code">
        <a :key="item.code" :href="localePath('index', item.code)">
          <icon :icon="item.icon" class="text-2xl" />{{ item.name }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup>
const { locale, locales } = useI18n()
const localePath = useLocalePath()
const currentLocalIcon = computed(() => {
  return locales.value.find((i) => i.code === locale.value).icon
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
