<template>
  <div id="app" class="layout-default">
    <div id="header-target"></div>
    <slot name="header">
      <HeaderMain />
    </slot>
    <main class="">
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
<style>
@reference "@/assets/css/main.css";

.layout-default {
  main {
    @apply container mx-auto flex-grow;
  }
}

#app {
  @apply flex min-h-screen flex-col;
}
</style>
