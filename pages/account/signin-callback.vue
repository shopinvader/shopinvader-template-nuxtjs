<template>

  <div class="p-4 h-screen flex justify-center items-center">
    <div class="pr-3 text-2xl">
      {{ $t('account.loading') }}
    </div>
    <spinner :size="20"></spinner>
  </div>
</template>
<script lang="ts">
import SpinnerVue from '~~/components/global/Spinner.vue'
  export default {
    layout: 'empty',
    name: 'signin-callback',
    data() {
      return {
        test: null
      }
    },
    components: {
      spinner: SpinnerVue
    },
    mounted() {
      const $auth = useNuxtApp()?.$auth || null
      $auth.userManager.signinCallback()
      .finally(() => {
        this.$router.push('/')
      })
    }
  }
</script>
