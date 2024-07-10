<template>
  <div>
    <div>
      <NuxtLayout>
        <div>
          <NuxtPage />
        </div>
      </NuxtLayout>
    </div>
  </div>
</template>
<script setup lang="ts">
const { origin } = useRequestURL()
const route = useRoute()
useHead({
  link: [
    {
      rel: 'canonical',
      href: `${origin}${route.path}`
    }
  ]
})
</script>
