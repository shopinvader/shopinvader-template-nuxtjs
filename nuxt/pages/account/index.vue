<template>
  <account-layout :slug="account" :navbar="false">
    <template #title>
      <h1 class="text-center text-2xl font-bold">
        {{ $t('account.title') }}
      </h1>
    </template>
    <template #content="{ items }">
      <div class="account-blocks">
        <div class="account-blocks__list">
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
    const router = useRouter()
    console.log('account', router.getRoutes())
    return {
      localePath
    }
  },
  meta: {
    title: 'Account'
  }
})
</script>

<style lang="scss">
.account-blocks {
  @apply w-full;
  &__list {
    @apply grid grid-cols-2 gap-4 lg:grid-cols-3;
  }
}
</style>
