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
          <ul v-if="child.childs.length > 0" class="subnav2">
            <li
              v-for="child2 in child.childs"
              :key="child2.id"
              class="subnav2-item"
            >
              <nuxt-link :to="localePath({ path: '/' + child2.urlKey })">
                {{ child2.name }}
              </nuxt-link>
            </li>
          </ul>
        </li>
      </ul>
    </li>
    <li class="nav-item-sm">
      <nuxt-link to="/account">
        <Icon icon="ph:user" class="text-sm text-blue-500" />
        {{ $t('account.title') }}
      </nuxt-link>
    </li>
  </ul>
</template>
<script lang="ts">
import { Category } from '~~/models/Category'

export default defineNuxtComponent({
  fetchKey: 'category',
  async asyncData() {
    let categories: Category[] = []
    try {
      const services = useShopinvaderServices()
      const result = await services?.categories?.search({
        size: 10,
        query: {
          term: {
            level: 0
          }
        }
      })
      categories = result?.hits || []
    } catch (error) {
      categories = []
      console.error(error)
    }

    return {
      categories
    }
  }
})
</script>
<style lang="scss">
.drawer-content {
  .nav {
    @apply menu p-0 font-semibold lg:menu-horizontal;

    &-item {
      position: inherit;
      .subnav {
        @apply relative left-0 z-20 -mt-2 w-screen grid-cols-5  items-start gap-4 p-2 lg:absolute lg:bg-base-100 lg:shadow lg:rounded-box;

        &-item {
          @apply border-r text-sm font-bold text-primary;
          .subnav2 {
            @apply text-base font-normal;
          }
        }
      }
    }
    &-item-sm {
      @apply flex md:hidden;
    }
    & > :where(li:hover) > :where(ul) {
      @apply grid;
    }
  }
}
.drawer-side {
  .nav {
    @apply pl-4;
    li {
      @apply flex flex-col;
      a {
        @apply flex items-center justify-start gap-3  py-3 pl-2 hover:bg-gray-100;
      }
    }
    .subnav {
      @apply font-bold;
      &-item {
        @apply border-b pl-3;
      }
      .subnav2 {
        @apply font-normal;
      }
    }
  }
}
</style>
