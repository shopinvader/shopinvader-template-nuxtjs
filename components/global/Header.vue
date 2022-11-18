<template>
  <header class="header">
    <div class="navbar bg-base-100">
      <div class="flex-1">
        <logo :height="20" :width="20"></logo>
        HEADER
      </div>
      <div class="flex-none">
        <ul class="menu menu-horizontal p-0">
          <li>
            <NuxtLink to="search">
              Search
            </NuxtLink>
          </li>
        </ul>
      </div>
      <local-switcher></local-switcher>
    </div>
  </header>
</template>
<script lang="ts">
  import Logo from '~/components/global/Logo.vue'
  import LocalSwitcher from '~/components/global/LocalSwitcher.vue'
  export default {
    name: 'Header',
    components: {
      'logo': Logo,
      'local-switcher': LocalSwitcher
    },
    setup(props) {
      
    }
  }
</script>
<style lang="scss">
  .header {
    @apply container border-b mx-auto px-4 sm:px-6 md:px-8 flex;
  }
</style>