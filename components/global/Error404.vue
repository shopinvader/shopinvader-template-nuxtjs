<template>
  <div class="container mx-auto py-20">
    <div class="max-lg-screen">
      <div class="flex flex-wrap items-center justify-center px-5 py-20 xl:px-10">
        <icon class="text-[20rem] text-gray-300" name="error" />
        <div>
          <div class="font-heading text-5xl">
            {{ $t('error.404.title') }}
          </div>
          <p class="pt-3">
            {{ $t('error.404.description') }}
          </p>
          <div class="py-4 text-center">
            <a href="/" class="btn btn-primary rounded-full">
              {{ $t('error.404.home') }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
const event = useRequestEvent()
if (event) {
  setResponseStatus(event, 404, 'Page Not Found')
}
</script>
