<template>
  <RobotMeta />
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<script setup lang="ts">
  defineRobotMeta()
  const { origin } = useRequestURL()
  const route = useRoute()
  useHead({
    link: [
      {
        rel: 'canonical',
        href: `${origin}${route.path}`
      },
    ],
  })
</script>
