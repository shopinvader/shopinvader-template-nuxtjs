<template>
  <div>
    <ul class="account-blocks__list">
      <NuxtLink to="/account/profile" class="account-blocks__block">
        <li
          :class="{ 'tab-active': $route.path.includes('profile') }"
          class="account-blocks__item"
        >
          <Icon icon="ph:user" class="mx-auto mb-3 text-2xl text-blue-500" />

          <span class="account-blocks_link">
            {{ $t('account.profile.title') }}
          </span>
        </li>
      </NuxtLink>
      <NuxtLink to="/account/addresses" class="account-blocks__block">
        <li
          :class="{ 'tab-active': $route.path.includes('profile') }"
          class="account-blocks__item"
        >
          <Icon
            icon="ph:address-book"
            class="mx-auto mb-3 text-2xl text-blue-500"
          />

          <span class="account-blocks_link">
            {{ $t('account.address.title') }}
          </span>
        </li>
      </NuxtLink>
      <NuxtLink to="/account/sales" class="account-blocks__block">
        <li
          :class="{ 'tab-active': $route.path.includes('profile') }"
          class="account-blocks__item"
        >
          <Icon
            icon="material-symbols:view-list-rounded"
            class="mx-auto mb-3 text-2xl text-blue-500"
          />

          <span class="account-blocks_link">
            {{ $t('account.sales.title') }}
          </span>
        </li>
      </NuxtLink>
      <NuxtLink to="/account/profile" class="account-blocks__block">
        <li
          :class="{ 'tab-active': $route.path.includes('profile') }"
          class="account-blocks__item"
        >
          <Icon
            icon="mdi:file-document-outline"
            class="mx-auto mb-3 text-2xl text-blue-500"
          />

          <span class="account-blocks_link">
            {{ $t('account.quotations') }}
          </span>
        </li>
      </NuxtLink>
      <NuxtLink to="/account/profile" class="account-blocks__block">
        <li
          :class="{ 'tab-active': $route.path.includes('profile') }"
          class="account-blocks__item"
        >
          <Icon
            icon="la:file-invoice"
            class="mx-auto mb-3 text-2xl text-blue-500"
          />

          <span class="account-blocks_link">
            {{ $t('account.invoices') }}
          </span>
        </li>
      </NuxtLink>
    </ul>
  </div>
</template>
<script lang="ts">
export default defineNuxtComponent({
  name: 'My account',
  data() {
    return {}
  }
})
</script>
<style lang="scss">
.account-blocks {
  &__list {
    @apply w-full mx-0 flex flex-wrap justify-start gap-2 md:gap-4 px-2 p-3 align-middle md:m-5 md:p-6;
  }
  &__block {
    width:48%;
    @apply md:m-2 m-0 my-auto flex h-48 flex-col justify-center border border-2 bg-base-100 md:p-6 align-middle shadow-sm h-48 md:h-56 md:w-56;
  }
  &__item {
    @apply flex flex-col justify-center;
  }
  &_link {
    @apply mx-auto text-sm text-blue-500;
  }
}
</style>
