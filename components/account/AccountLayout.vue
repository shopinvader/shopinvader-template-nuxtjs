<template>
  <div class="account-layout">
    <AccountNavbar :slug="slug"> </AccountNavbar>
    <div class="main">
      <div class="text-xl md:text-3xl text-primary-500 font-sans py-2">
        <slot name="title"></slot>
      </div>
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import AccountNavbar from "~/components/account/AccountNavbar.vue";
export default defineNuxtComponent({
  name: "AccountLayout",
  components: {
    AccountNavbar,
  },
  props: {
    slug: {
      required: false,
      type: String,
    },
  },
});
</script>

<style lang="scss">
.account-layout {
  @apply my-4 w-full bg-white shadow-md shadow-primary rounded;
  .main {
    min-height: 500px;
    @apply p-5;
  }
}
</style>
