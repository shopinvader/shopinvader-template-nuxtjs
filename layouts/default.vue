<template>
  <div id="app">
    <div id="header-target"></div>
    <slot name="header">
      <HeaderMain />
    </slot>
    <main>
      <slot name="body"> </slot>
      <slot></slot>
    </main>
    <FooterMain />
    <client-only>
      <lazy-navbar-bottom class="md:hidden"></lazy-navbar-bottom>
      <Notifications />
    </client-only>
  </div>
</template>
<script lang="ts" setup></script>
<style lang="scss">
main {
  @apply container mx-auto flex-grow;
}

#app {
  @apply flex min-h-screen flex-col;
}
</style>
