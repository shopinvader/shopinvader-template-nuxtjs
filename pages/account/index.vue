<template>
  <div class="account-dashboard">
    <account-layout :slug="account" :navbar="false">
      <template #title>
        <div class="dashboard__title">
          <div>
            <h1 class="title">
              {{ $t('account.title') }}
            </h1>
          </div>
          <button type="button" class="btn btn-link flex gap-1" @click="logout">
            <icon name="logout" />
            {{ $t('account.logout') }}
          </button>
        </div>
      </template>
      <template #content="{ items }">
        <div class="dashboard__blocks">
          <div class="blocks__list">
            <account-icon
              v-for="item in items"
              :key="item.slug"
              :icon="item.icon"
              :label="item.title"
              :link="localePath(item.slug)"
            />
          </div>
        </div>
      </template>
    </account-layout>
  </div>
</template>
<script lang="ts">
import AccountLayout from '~/components/account/AccountLayout.vue'
export default defineNuxtComponent({
  name: 'account',
  components: {
    'account-layout': AccountLayout
  },
  setup() {
    const localePath = useLocalePath()
    const { t } = useI18n()
    const auth = useShopinvaderService('auth')
    const user = auth.getUser().value
    definePageMeta({
      auth: true
    })
    const logout = () => {
      auth.logoutRedirect()
    }
    useSeoMeta({
      title: t(`account.title`)
    })
    return {
      localePath,
      logout,
      user
    }
  },
  meta: {
    title: 'Account'
  }
})
</script>

<style lang="scss">
.account-dashboard {
  .dashboard {
    &__title {
      @apply flex justify-between items-center w-full;
      .title {
        @apply text-center text-2xl font-bold m-0 p-0;
      }
    }
    &__blocks {
      @apply w-full;
      .blocks {
        &__list {
          @apply grid grid-cols-2 gap-4 lg:grid-cols-3;
        }
      }
    }
  }
}
</style>
