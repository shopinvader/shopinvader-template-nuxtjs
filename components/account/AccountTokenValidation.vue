<template>
  <section
    v-if="auth?.type == 'credentials'"
    class="flex h-screen flex-col items-center overflow-hidden bg-gradient-to-tr from-gray-400 via-yellow-50 to-gray-400 py-10"
  >
    <div v-if="!urlHasToken" class="container mx-auto px-4">
      <div class="rounded-3xl bg-white p-10">
        <div class="py-4 text-left">
          <nuxt-link :to="localePath('/')" class="btn btn-primary btn-sm rounded-full text-white">
            <icon name="left" class="inline"> </icon>
            {{ $t('btn.back_to_homepage') }}
          </nuxt-link>
        </div>
        <div class="my-8 flex flex-wrap md:items-center">
          <div class="w-full rounded-3xl bg-gray-100 px-8 py-20 text-center lg:px-20">
            <div class="pb-6 text-center">
              <icon name="close" class="inline rounded-full bg-error p-1 text-4xl text-white">
              </icon>
            </div>
            <div class="text-lg font-bold">
              {{ $t('account.register.notification_token_error') }}
            </div>
            <div>
              {{ $t('account.register.notification_token_error_info') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import type { AuthCredentialService } from '#services'
const auth = useShopinvaderService('auth') as AuthCredentialService
const localePath = useLocalePath()
const urlHasToken = ref<boolean>(false)
const route = useRoute()
onMounted(async () => {
  if (!route.query.token) {
    urlHasToken.value = false
  } else if (route.query.token) {
    urlHasToken.value = true
    try {
      await auth?.validateEmail(route.query?.token?.toString() || '')
      auth?.loginRedirect(localePath(`/account/profile`))
    } catch {
      urlHasToken.value = false
    }
  }
})
</script>
