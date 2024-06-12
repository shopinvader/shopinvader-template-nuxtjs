<template>
  <div class="flex h-screen items-center justify-center p-4">
    <div class="pr-3 text-2xl">
      {{ $t('account.loading') }}
    </div>
    <spinner :size="20"></spinner>
  </div>
</template>
<script lang="ts">
import SpinnerVue from '~~/components/global/Spinner.vue'
export default {
  name: 'SigninCallback',
  components: {
    spinner: SpinnerVue
  },
  layout: 'empty',
  data() {
    return {
      test: null
    }
  },
  mounted() {
    const { $auth } = useNuxtApp()
    $auth.userManager.signinCallback().finally(() => {
      this.$router.push('/')
    })
  },
  setup() {
    const localePath = useLocalePath()
    const auth = useShopinvaderService('auth')
    if (auth?.type !== 'credentials') {
      /** back to home if is not auth provider credential */
      navigateTo({ path: '/' })
    }
    return {
      localePath,
      auth
    }
  }
}
</script>
