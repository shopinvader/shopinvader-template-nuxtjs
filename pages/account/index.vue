<template>
  <div class="account-dashboard">
    <account-layout slug="account" :navbar="false">
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
<script lang="ts" setup>
const localePath = useLocalePath()
const { t } = useI18n()
const auth = useShopinvaderService('auth')
definePageMeta({
  auth: true,
  pageTransition: false
})
const logout = async () => {
  if (auth) {
    await auth.logoutRedirect()
  }
}
useSeoMeta({
  title: t(`account.title`)
})
</script>

<style>
@reference "@/assets/css/main.css";

.account-dashboard {
  .dashboard {
    &__title {
      @apply flex w-full items-center justify-between;
      .title {
        @apply m-0 p-0 text-center text-2xl font-bold;
      }
    }
    &__blocks {
      @apply w-full;
      .blocks {
        &__list {
          @apply grid sm:grid-cols-2 gap-4 lg:grid-cols-3;
        }
      }
    }
  }
}
</style>
