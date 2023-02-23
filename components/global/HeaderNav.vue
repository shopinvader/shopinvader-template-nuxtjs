<template>
  <ul class="nav">
    <li
      v-for="(category, index) in categories"
      :key="category.id"
      :tabindex="index"
      class="nav-item"
    >
      <nuxt-link :to="localePath({ path: '/' + category.urlKey })">
        {{ category.name }}
        <svg
          v-if="category.childs.length > 0"
          class="fill-current"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <path
            d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"
          />
        </svg>
      </nuxt-link>
      <ul v-if="category.childs.length > 0" class="subnav">
        <li
          v-for="child in category.childs"
          :key="child.id"
          class="subnav-item"
        >
          <nuxt-link :to="localePath({ path: '/' + child.urlKey })">
            {{ child.name }}
          </nuxt-link>
        </li>
      </ul>
    </li>
  </ul>
</template>
<script lang="ts">
import { Category } from '~~/models/Category'
export default defineNuxtComponent({
  fetchKey: 'category',
  async asyncData() {
    const services = useShopinvaderServices()
    const result = await services?.categories?.search({
      size: 10,
      query: {
        term: {
          level: 0
        }
      }
    })
    const categories: Category[] = result?.hits || []
    return {
      categories
    }
  }
})
</script>
<style lang="scss">
.nav {
  @apply menu p-0 lg:menu-horizontal;

  &-item {
    .subnav {
      @apply relative left-0 p-2 lg:absolute lg:bg-base-100 lg:shadow lg:rounded-box;

      &-item {
        @apply text-sm;
      }
    }
  }
}
</style>
