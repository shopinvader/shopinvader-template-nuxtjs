<template>
  <div class="container hero m-8 min-h-screen bg-base-200">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <h1 class="text-5xl font-bold">
          {{ $t('404.title') }}
        </h1>
        <p class="py-6">
          {{ $t('404.description') }}
        </p>
        <NuxtLink to="/" class="btn-primary btn">
          {{ $t('404.home') }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: 'PageNotFoundError'
}
</script>
