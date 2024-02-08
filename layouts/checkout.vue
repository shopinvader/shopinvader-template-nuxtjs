<template>
  <div id="app">
    <div id="header-target"></div>
    <slot name="header">
      <header-lite> </header-lite>
    </slot>
    <main>
      <client-only>
        <slot></slot>
      </client-only>
    </main>
    <navbar-bottom class="md:hidden"></navbar-bottom>
    <notifications-vue></notifications-vue>
  </div>
</template>
<script lang="ts" setup>
  definePageMeta({
    layout: false
  })
</script>
