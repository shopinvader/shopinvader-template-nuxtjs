<template>
  <client-only fallbackTag="div">
    <template #fallback>
      <div class="account-layout__loading">
        <spinner />
      </div>
    </template>
    <div v-if="user" class="account-layout">
      <slot v-if="navbar" name="navbar">
        <account-navbar
          v-if="items && items?.length > 0"
          :items="items"
          :selected="slug"
          class="account-layout__navbar"
        >
          <template #extra="{ pages }">
            <li v-if="pages.length > 0" class="extra">
              <nuxt-link :to="localePath('account-logout')">
                <icon name="logout" />
                {{ $t('account.logout') }}
              </nuxt-link>
            </li>
          </template>
        </account-navbar>
      </slot>
      <div class="account-layout__main">
        <div class="main__head">
          <slot name="title">
            <div class="head__back">
              <nuxt-link :to="localePath('account')">
                <icon name="left"></icon>
              </nuxt-link>
            </div>
            <template v-if="currentPage">
              <div class="head">
                <icon class="head__icon" :name="currentPage.icon"></icon>
                <h1 class="head__title">
                  {{ currentPage?.title }}
                </h1>
                <button @click="logout" class="head__logout">
                  <icon name="logout" class="" />
                  {{ $t('account.logout') }}
                </button>
              </div>
            </template>
          </slot>
        </div>
        <div v-if="!loading" class="main__content">
          <slot name="content" :items="items"></slot>
        </div>
        <div v-else="loading" class="main__loading">
          <spinner/>
        </div>
      </div>
    </div>
  </client-only>
</template>

<script lang="ts">
import type { User } from '#models'

export default defineNuxtComponent({
  name: 'AccountLayout',
  props: {
    slug: {
      required: false,
      type: String,
      default: ''
    },
    navbar: {
      required: false,
      type: Boolean,
      default: true
    }
  },
  setup() {
    const loading = ref(false)
    const user = ref(null) as Ref<User | boolean | null>
    const auth = useShopinvaderService('auth')
    const localePath = useLocalePath()
    const logout = () => {
      loading.value = true
      try {
        auth.logoutRedirect()
      } catch (error) {
        console.error(error)
      } finally {
        loading.value = false
      }
    }
    onMounted(() => {
      user.value = auth.getUser()?.value || null
    })
    return {
      localePath,
      logout,
      loading,
      user
    }
  },
  data() {
    return {
      items: [
        {
          title: this.$t('account.profile.title'),
          icon: 'profile',
          slug: 'account-profile'
        },
        {
          title: this.$t('account.address.title'),
          icon: 'addresses',
          slug: 'account-addresses'
        },
        {
          title: this.$t('account.sales.title'),
          icon: 'sales',
          slug: 'account-sales'
        }
      ]
    }
  },
  computed: {
    currentPage() {
      return this.items.find((item) => item.slug === this.slug) || null
    }
  }
})
</script>

<style lang="scss">
.account-layout {
  @apply w-full gap-1 lg:flex;
  &__loading {
    @apply flex justify-center items-center h-32;
  }
  &__navbar {
    @apply lg:w-1/3 lg:p-3 xl:w-1/4;
  }
  &__main {
    @apply w-full;
    .main {
      &__head {
        @apply flex items-start sm:items-center gap-2 border-b p-3 text-xl max-sm:shadow md:pb-3 lg:text-3xl;
        .head {
          @apply flex flex-wrap justify-between w-full gap-2 sm:items-center;
          &__icon {
            @apply text-2xl md:text-4xl;
          }
          &__title {
            @apply flex-1 m-0 p-0 text-lg sm:text-xl md:text-4xl;
          }
          &__back {
            @apply cursor-pointer text-primary lg:hidden;
          }
          &__logout {
            @apply btn max-sm:hidden sm:btn-sm btn-primary;
          }
        }
      }
      &__content {
        @apply container mx-auto min-h-screen p-3;
      }
      &__loading {
        @apply flex justify-center items-center min-h-36 pt-10;
      }
    }
  }
}
</style>
