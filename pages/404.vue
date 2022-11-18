<template>
  <div class="hero min-h-screen bg-base-200 container m-8">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <h1 class="text-5xl font-bold">
          {{ $t('404.title') }}
        </h1>
        <p class="py-6">
          {{ $t('404.description') }}
        </p>
        <NuxtLink to="/" class="btn btn-primary">
          {{ $t('404.home') }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>