<template>
  <ClientOnly>
    <div class="account-layout">
      <slot v-if="navbar" name="navbar">
        <account-navbar
          v-if="items && items?.length > 0"
          :items="items"
          :selected="slug"
          class="account-layout__navbar"
        ></account-navbar>
      </slot>
      <div class="account-layout__main">
        <div class="main__title">
          <slot name="title">
            <div class="title__back">
              <nuxt-link :to="localePath('account')">
                <icon icon="ph:arrow-left"></icon>
              </nuxt-link>
            </div>
            <template v-if="currentPage">
              <icon :icon="currentPage.icon"></icon>
              <h1>{{ currentPage?.title }}</h1>
            </template>
          </slot>
        </div>
        <div class="main__content">
          <slot name="content" :items="items"></slot>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script lang="ts">
import AccountNavbar from '~/components/account/AccountNavbar.vue'
export default defineNuxtComponent({
  name: 'AccountLayout',
  components: {
    'account-navbar': AccountNavbar
  },
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
  data() {
    return {
      items: [
        {
          title: this.$t('account.profile.title'),
          icon: 'ph:user-list',
          slug: 'account-profile'
        },
        {
          title: this.$t('account.address.title'),
          icon: 'ph:address-book-light',
          slug: 'account-addresses'
        },
        {
          title: this.$t('account.sales.title'),
          icon: 'ph:list-dashes',
          slug: 'account-sales'
        },
        {
          title: this.$t('account.quotations'),
          icon: 'ph:file',
          slug: 'account-quotations'
        },
        {
          title: this.$t('account.invoices'),
          icon: 'ph:files',
          slug: 'account-invoices'
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
      &__title {
        @apply flex items-center gap-2 border-b p-3 text-xl max-sm:shadow md:pb-3 lg:text-3xl;
        .title {
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
