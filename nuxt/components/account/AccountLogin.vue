<template>
  <div
    class="flex items-center h-screen overflow-hidden bg-gradient-to-tr from-gray-400 via-yellow-50 to-gray-400"
  >
    <div class="container mx-auto px-4">
      <div
        class="mx-auto rounded-3xl bg-white pt-16 pb-24 md:max-w-3xl md:pb-52"
      >
        <div class="flex justify-center pb-4">
          <Logo></Logo>
        </div>
        <div class="mx-auto md:max-w-md">
          <div class="mb-10 text-center">
            <h2
              class="font-heading mb-4 text-4xl font-black tracking-tight text-black md:text-5xl"
            >
              {{ $t('account.login.welcome_back') }}
            </h2>
            <p class="font-bold text-gray-500">
              {{ $t('account.login.description') }}
            </p>
          </div>
          <form>
            <div class="-m-3 flex flex-wrap">
              <div class="w-full p-3">
                <label
                  class="mb-2 block text-sm font-bold text-gray-500"
                  for="signInLightReverseInput3-1"
                  >{{ $t('account.address.email') }}</label
                >
                <input
                  class="w-full appearance-none rounded-full border border-gray-200 bg-gray-100 px-6 py-3.5 text-lg font-bold text-gray-500 placeholder-gray-500 outline-none focus:ring-4 focus:ring-secondary"
                  id="signInLightReverseInput3-1"
                  type="email"
                  placeholder="Enter email address"
                />
              </div>
              <div class="w-full p-3">
                <label
                  class="mb-2 block text-sm font-bold text-gray-500"
                  for="signInLightReverseInput3-2"
                  >{{ $t('account.login.password') }}</label
                >
                <div
                  class="overflow-hidden rounded-full border border-gray-200 focus-within:ring-4 focus-within:ring-secondary"
                >
                  <div class="flex flex-wrap">
                    <div class="flex-1">
                      <input
                        class="w-full appearance-none bg-gray-100 px-6 py-3.5 text-lg font-bold text-gray-500 placeholder-gray-500 outline-none"
                        id="signInLightReverseInput3-2"
                        type="password"
                        placeholder="*************"
                      />
                    </div>
                    <div class="w-auto">
                      <a
                        class="flex h-full items-center bg-gray-100 pr-4 font-bold text-secondary hover:text-primary"
                        href="#"
                        >{{ $t('account.login.forgot_password') }}</a
                      >
                    </div>
                  </div>
                </div>
              </div>
              <div class="w-full p-3">
                <div class="-m-2 flex flex-wrap md:justify-end">
                  <div class="w-full p-2">
                    <a
                      class="block rounded-full bg-primary px-8 py-3.5 text-center text-lg font-bold text-white hover:bg-secondary focus:ring-2 focus:ring-primary"
                      @click="login"
                      >{{ $t('account.login.sign_in') }}</a
                    >
                  </div>
                </div>
              </div>
              <div class="w-full p-3">
                <p class="text-center font-bold text-gray-600">
                  <span>{{ $t('account.login.not_yet_account') }}</span
                  ><nuxt-link
                    class="cursor-pointer font-bold text-secondary hover:text-primary"
                    :to="localePath('/account/register')"
                    >{{ $t('account.login.create_account') }}</nuxt-link
                  >
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
export default defineNuxtComponent({
  name: 'AccountLogin',
  components: {
    Logo: 'Logo'
  },
  setup() {
    const localePath = useLocalePath()
    return {
      localePath
    }
  }
})
</script>
