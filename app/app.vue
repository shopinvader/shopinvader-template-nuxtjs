<template>
  <div>
    <div>
      <NuxtLoadingIndicator color="#000"/>
      <NuxtLayout>
        <div>
          <NuxtPage />
        </div>
      </NuxtLayout>
    </div>
  </div>
</template>
<script setup lang="ts">
const { locale } = useI18n()
const { origin } = useRequestURL()
const route = useRoute()
const canonical = ref(`${origin}${route.path}`)

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
