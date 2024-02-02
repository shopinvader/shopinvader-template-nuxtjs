<template>
  <div v-if="user" class="account-layout">
    <slot v-if="navbar" name="navbar">
      <account-navbar
        v-if="items && items?.length > 0"
        :items="items"
        :selected="slug"
        class="account-layout__navbar"
      ></account-navbar>
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
              <button class="btn btn-primary" @click="logout">
                <icon name="logout" class="" />
                {{ $t('account.logout') }}
              </button>
            </div>
          </template>
        </slot>
      </div>
      <div class="main__content">
        <slot name="content" :items="items"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
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
      type: Array,
      default: true
    }
  },
  setup() {
    const auth = useShopinvaderService('auth')
    const user = auth.getUser()
    const localePath = useLocalePath()
    const logout = () => {
      auth.logoutRedirect()
    }
    return {
      localePath,
      logout,
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
  &__navbar {
    @apply lg:w-1/3 lg:p-3 xl:w-1/4;
  }
  &__main {
    @apply w-full;
    .main {
      &__head {
        @apply flex items-center gap-2 border-b p-3 text-xl max-sm:shadow md:pb-3 lg:text-3xl;
        .head {
          @apply flex justify-between w-full gap-2 items-center;
          &__icon {
            @apply text-2xl md:text-5xl;
          }
          &__title {
            @apply flex-1 m-0 p-0 text-xl md:text-4xl;
          }
          &__back {
            @apply cursor-pointer text-primary lg:hidden;
          }
        }
      }
      &__content {
        @apply container mx-auto min-h-screen p-3;
      }
    }
  }
}
</style>
