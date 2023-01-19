<template>
  <div class="account-layout">
    <AccountNavbar :slug="slug"> </AccountNavbar>
    <div class="main">
      <div class="text-primary-500 py-2 font-sans text-xl md:text-3xl">
        <slot name="title"></slot>
      </div>
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import AccountNavbar from '~/components/account/AccountNavbar.vue'
export default defineNuxtComponent({
  name: 'AccountLayout',
  components: {
    AccountNavbar
  },
  props: {
    slug: {
      required: false,
      type: String,
      default: ''
    }
  }
})
</script>

<style lang="scss">
.account-layout {
  @apply mb-4 w-full bg-white;
  .main {
    min-height: 500px;
    @apply p-5;
  }
}
</style>
