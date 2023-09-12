<template>
  <div class="container mx-auto py-20">
      <div class="max-lg-screen">
        <div
          class="flex flex-wrap items-center justify-center px-5 py-20 xl:px-10"
        >
          <icon class="text-[20rem] text-gray-300" icon="clarity:error-line" />
          <div>
            <div class="text-5xl font-heading ">
              {{ $t('error.404.title') }}
            </div>
            <p class="pt-3">
              {{ $t('error.404.description') }}
            </p>
            <div class="py-4 text-center">
              <a href="/" class=" btn-primary btn rounded-full">
                {{ $t('error.404.home') }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
<script lang="ts" setup>
const { t } = useI18n()
const event = useRequestEvent()
setResponseStatus(event, 404, 'Page Not Found')
</script>
