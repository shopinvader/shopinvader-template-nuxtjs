<template>
  <div>
    <Error404></Error404>
  </div>
</template>
<script lang="ts" setup>
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
</script>
