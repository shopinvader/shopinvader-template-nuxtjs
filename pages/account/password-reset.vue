<template>
  <nuxt-layout name="login">
    <template #body>
      <div
        class="mx-auto rounded-3xl bg-white px-4 pt-16 md:max-w-3xl md:px-0 md:pb-52"
      >
        <div class="flex justify-center pb-4">
          <Logo></Logo>
        </div>
        <div class="mx-auto md:max-w-md">
          <account-password-reset ></account-password-reset>
        </div>
      </div>
    </template>
  </nuxt-layout>
</template>
<script setup lang="ts">
definePageMeta({
  layout: false
})
</script>
