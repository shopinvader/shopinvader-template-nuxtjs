<template>
  <nav class="accountNavbar">
    <div class="accountNavbar-content">
      <div class="accountNavbar-content-intro">
        <NuxtLink to="/account/profile">
          {{ $t('account.title') }}
        </NuxtLink>
      </div>
      <ul class="accountNavbar-content-list tabs">
        <li
          class="tab tab-bordered"
          :class="{ 'tab-active': $route.path.includes('profile') }"
        >
          <NuxtLink to="/account/profile">
            {{ $t('account.profile.title') }}
          </NuxtLink>
        </li>
        <li
          class="tab tab-bordered"
          :class="{ 'tab-active': $route.path.includes('addresses') }"
        >
          <NuxtLink to="/account/addresses">
            {{ $t('account.address.title') }}
          </NuxtLink>
        </li>
        <li
          class="tab tab-bordered"
          :class="{ 'tab-active': $route.path.includes('sales') }"
        >
          <NuxtLink to="/account/sales">
            {{ $t('account.sales.title') }}
          </NuxtLink>
        </li>
        <li
          class="tab tab-bordered"
          :class="{ 'tab-active': $route.path.includes('quotations') }"
        >
          <NuxtLink to="/account/profile">
            {{ $t('account.quotations') }}
          </NuxtLink>
        </li>
        <li
          class="tab tab-bordered"
          :class="{ 'tab-active': $route.path.includes('invoices') }"
        >
          <NuxtLink to="/account/profile">
            {{ $t('account.invoices') }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script lang="ts">
export default defineNuxtComponent({
  name: 'AccountNavbar',
  components: {},
  props: {
    slug: {
      required: true,
      type: String
    }
  }
})
</script>

<style lang="scss">
.accountNavbar {
  @apply text-xs
      xl:text-sm;
  &-content {
    @apply flex
        w-full
        items-stretch
        text-primary;
    &-intro {
      @apply flex
          items-center
          rounded-br-lg
          bg-primary
          p-4
          px-5
          font-sans
          font-bold
          text-white;
    }
    &-list {
      @apply hidden flex-grow items-center justify-end md:flex;
    }
  }
}
</style>
