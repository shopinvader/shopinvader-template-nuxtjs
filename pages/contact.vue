<template>
  <contact-form :data-policy-page="dataPolicyPage"></contact-form>
</template>
<script lang="ts" setup>
  const dataPolicyPage = ref(null) as Ref<String | null>
  const localePath = useLocalePath()
  dataPolicyPage.value = localePath({ path: '/privacy-policy'})

</script>
