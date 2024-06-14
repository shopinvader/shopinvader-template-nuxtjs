<template>
  <header>
    <aside-menu name="header" class="header" class-content="header-navbar">
      <template #title>
        <nuxt-link :to="localePath({ name: 'index' })" class="flex items-center">
          <logo :height="40" :width="50"></logo>
        </nuxt-link>
      </template>
      <template #content>
        <div></div>
      </template>
    </aside-menu>
  </header>
  <main>
    <div class="container mx-auto py-20">
      <div class="max-lg-screen">
        <div class="flex flex-wrap items-center justify-center px-5 py-20 xl:px-10">
          <icon class="text-[20rem] text-gray-300" name="error" />
          <div>
            <h1 class="text-9xl text-primary">
              {{ error.statusCode }}
            </h1>
            <template v-if="error.statusCode === 404">
              <div class="text-2xl">
                {{ $t('error.404.title') }}
              </div>
            </template>
            <template v-else>
              <div class="text-2xl">
                {{ $t('error.generic') }}
              </div>
            </template>
            <div class="py-4 text-center">
              <a href="/" class="btn btn-primary btn-outline btn-wide">
                {{ $t('btn.back') }}
              </a>
            </div>
          </div>

          <div v-if="error.statusCode !== 404" class="w-full flex-grow p-3 xl:px-10">
            <div v-if="error.message" class="mockup-code">
              <pre data-prefix="$"><code> {{ error.message }}</code></pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
  <footer></footer>
</template>

<script setup>
const localePath = useLocalePath()
</script>
