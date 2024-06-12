<template>
  <nav class="account-navbar">
    <div class="account-navbar__content">
      <div class="content__intro">
        <div class="intro__icon">
          <icon name="user-circle" class="text-5xl" />
        </div>
        <div class="intro__body">
          <nuxt-link :to="localePath('account')" class="title">
            {{ $t('account.title') }}
          </nuxt-link>
          <div v-if="user" class="intro">{{ user?.name }}</div>
        </div>
        <div class="intro__btn">
          <button class="btn-link text-white" @click="display = !display">
            <icon name="ph:list" class="text-4xl" />
          </button>
        </div>
      </div>
      <ul :class="{ 'content__list--shown': display }" class="content__list">
        <li v-for="page in pages" :key="page.slug" :class="{ active: page.active }">
          <nuxt-link :to="localePath(page.slug)">
            <icon :name="page.icon" />
            {{ page.title }}
          </nuxt-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script lang="ts">
import type { PropType } from 'vue'
interface Page {
  title: string
  icon: string
  slug: string
  active?: boolean
}
export default defineNuxtComponent({
  name: 'AccountNavbar',
  props: {
    items: {
      required: true,
      type: Array as PropType<Page[]>
    }
  },
  data() {
    const auth = useShopinvaderService('auth')
    return {
      display: false,
      user: auth?.getUser()
    }
  },
  computed: {
    pages() {
      const route = useRoute()
      const localePath = useLocalePath()
      return this.items.map((item) => {
        return {
          ...item,
          active: route.path === localePath(item.slug)
        }
      })
    },
    route() {
      return useRoute()
    }
  }
})
</script>

<style lang="scss">
.account-navbar {
  @apply h-full;
  &__content {
    @apply h-full;
    .content {
      &__intro {
        @apply flex w-full bg-gradient-to-r from-primary to-primary/90 p-2 font-sans text-white lg:rounded-br-lg lg:rounded-tl-lg xl:px-4;
        .intro {
          &__icon {
            @apply mr-2;
          }
          &__btn {
            @apply lg:hidden;
          }
          &__body {
            @apply flex-grow;
            .title {
              @apply py-0 text-xl font-bold;
            }
            .intro {
              @apply py-0 text-sm;
            }
          }
        }
      }
      &__list {
        @apply menu truncate text-ellipsis rounded border-b-4 border-primary bg-gray-50 py-4 max-lg:hidden;
        &--shown {
          @apply block;
        }
        .active {
          @apply font-bold text-primary;
        }
      }
    }
  }
}
</style>
