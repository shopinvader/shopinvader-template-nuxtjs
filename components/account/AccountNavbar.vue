<template>
  <nav class="accountNavbar">
    <div class="accountNavbar-content">
      <div class="accountNavbar-content-intro">
        <NuxtLink to="/">
          {{ $t("account.title" )}}
        </NuxtLink>
      </div>
      <ul class="accountNavbar-content-list">
        <li class="accountNavbar-content-list-item">
          <NuxtLink to="/account/profile" :class="{ active: slug == 'profile' }">
            {{ $t("account.profile") }}
          </NuxtLink>
        </li>
        <li class="accountNavbar-content-list-item">
          <NuxtLink to="/account/sales" :class="{ active: slug == 'sales' }">
            {{ $t("account.sales.title") }}
          </NuxtLink>
        </li>
        <li class="accountNavbar-content-list-item">
          <NuxtLink to="/" :class="{ active: slug == 'quotations' }">
           {{ $t("account.quotations") }}
          </NuxtLink>
        </li>
        <li class="accountNavbar-content-list-item">
          <NuxtLink to="/" :class="{ active: slug == 'quotations' }">
           {{ $t("account.invoices") }}
          </NuxtLink>
        </li>
        <li class="accountNavbar-content-list-item">
          <NuxtLink to="/" :class="{ active: slug == 'quotations' }">
           {{ $t("account.addresses") }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script lang="ts">
export default defineNuxtComponent({
  name: "AccountNavbar",
  components: {},
  props: {
    slug: {
      required: true,
      type: String,
    },
  }
});
</script>

<style lang="scss">
.accountNavbar {
  @apply text-xs
      xl:text-sm
      w-full
      z-20;
  &-content {
    @apply flex
        items-stretch
        text-primary
        max-w-7xl
        w-full;
    &-intro {
      @apply flex
          font-sans
          items-center
          p-2
          px-5
          font-bold
          text-white
          bg-primary
          rounded-br-lg;
    }
    &-list {
      @apply hidden md:flex flex-grow items-center;
      &-item {
        @apply font-sans p-3
            text-center
            uppercase
            font-bold
            text-primary;
        a {
          @apply block p-1 px-2;
          &.active {
            @apply rounded font-sans p-1 px-4 bg-primary text-white;
          }
        }
      }
    }
  }
}
</style>
