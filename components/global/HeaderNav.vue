<template>
  <ul class="nav">
    <li v-for="(category, index) in categories" :key="category.id" :tabindex="index" class="nav-item">
      <nuxt-link :to="localePath({ path: '/' + category.urlKey })">
        {{ category.name }}
        <svg v-if="category.childs.length > 0" class="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
      </nuxt-link>
      <ul v-if="category.childs.length > 0" class="subnav">
        <li v-for="child in category.childs" class="subnav-item">
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
export default {
  data() {
    return {
      categories: [] as Category[]
    }
  },
  async setup() {
    const services = useShopinvaderServices()
   
    const result = await services?.categories?.search({
      size: 10,
      query: {
        term: {
          level: 0
        }
      }
    })
    return {
      categories: result?.hits || []
    }
  }
}
</script>
<style lang="scss">
  .nav {
    @apply menu lg:menu-horizontal p-0;
    &-item {
      .subnav {
        @apply lg:rounded-box lg:bg-base-100 p-2 lg:shadow relative lg:absolute left-0;
        &-item {
          @apply text-sm;
        }
      }
    }
  }
</style>