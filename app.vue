<template>
  <div>
    <UApp>
      <NuxtLoadingIndicator color="#000"/>
      <NuxtLayout>
        <div>
          <NuxtPage />
        </div>
      </NuxtLayout>
    </UApp>
  </div>
</template>
<script setup lang="ts">
const { origin } = useRequestURL()
const route = useRoute()
const canonical = ref(`${origin}${route.path}`)
const { locale } = useI18n()
watchEffect(() => {
  canonical.value = `${origin}${route.path}`
})
useHead({
  htmlAttrs: {
    lang: locale
  },
  link: [
    {
      rel: 'canonical',
      href: canonical.value
    }
  ]
})
</script>
