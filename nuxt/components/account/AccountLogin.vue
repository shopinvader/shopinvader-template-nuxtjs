<template>
  <div
    class="flex h-screen flex-col items-center overflow-hidden bg-gradient-to-tr from-gray-400 via-yellow-50 to-gray-400"
  >
  
    <div class="container mx-auto p-4 pt-16 md:max-w-3xl md:px-0">
      <nuxt-link
        :to="localePath('/')"
        class="btn-primary btn-sm btn rounded-full text-white"
      >
        <icon icon="material-symbols:arrow-back-ios" class="inline"> </icon>
        {{ $t('btn.back_to_homepage') }}
      </nuxt-link>
    </div>
    <div class="container mx-auto px-4">
      <div
        class="mx-auto rounded-3xl bg-white px-4 pt-16 md:max-w-3xl md:px-0 md:pb-52"
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
          <form @submit.prevent="accountLogin">
            <div class="-m-3 flex flex-wrap">
              <div class="w-full p-3">
                <label
                  class="mb-2 block text-sm font-bold text-gray-500"
                  for="email"
                  >{{ $t('account.address.email') }}</label
                >
                <input
                  id="email"
                  v-model="login"
                  class="w-full appearance-none rounded-full border border-gray-100 bg-gray-100 px-6 py-3.5 text-lg font-bold text-gray-500 placeholder-gray-500 outline-none focus:ring-4 focus:ring-secondary"
                  type="email"
                  @keyup="checkValidity('login', $event)"
                  required
                  placeholder="Enter email address"
                />
              </div>
              <div class="pl-4 text-sm italic text-red-500" v-if="error.login">
                {{ error.login }}
              </div>

              <div class="w-full p-3">
                <label
                  class="mb-2 block text-sm font-bold text-gray-500"
                  for="password"
                  >{{ $t('account.login.password') }}</label
                >
                <div
                  class="overflow-hidden rounded-full border border-gray-200 focus-within:ring-4 focus-within:ring-secondary"
                >
                  <div class="flex flex-wrap">
                    <div class="flex-1">
                      <input
                        id="password"
                        v-model="password"
                        @keyup="checkValidity('password', $event)"
                        class="w-full appearance-none bg-gray-100 px-6 py-3.5 text-lg font-bold text-gray-500 placeholder-gray-500 outline-none focus:border-2 focus:outline-0"
                        required
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
              <div
                class="pl-4 text-sm italic text-red-500"
                v-if="error.password"
              >
                {{ error.password }}
              </div>
              <div class="w-full p-3">
                <div class="-m-2 flex flex-wrap md:justify-end">
                  <div class="w-full p-2">
                    <button
                      type="submit"
                      class="block w-full rounded-full bg-primary px-8 py-3.5 text-center text-lg font-bold text-white hover:bg-secondary focus:ring-2 focus:ring-primary"
                    >
                      {{ $t('account.login.sign_in') }}
                    </button>
                  </div>
                </div>
              </div>
              <div class="w-full p-3">
                <p class="text-center font-bold text-gray-600">
                  <span class="mr-2">
                    {{ $t('account.login.not_yet_account') }} </span
                  ><nuxt-link
                    class="cursor-pointer font-bold text-secondary hover:text-primary"
                    :to="localePath('/account/register')"
                  >
                    {{ $t('account.login.create_account') }}</nuxt-link
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
import LogoVue from '../global/Logo.vue'

export default defineNuxtComponent({
  name: 'AccountLogin',
  components: {
    logo: LogoVue
  },
  data() {
    return {
      login: null,
      password: null,
      error: {
        login: null,
        password: null
      }
    }
  },
  setup() {
    const localePath = useLocalePath()
    return {
      localePath
    }
  },
  methods: {
    checkValidity(input: string, e: Event) {
      this.error.login = null
      this.error.password = null
      if (e.target?.validity.valid == false) {
        if (input == 'login') {
          this.error.login = this.$t('error.login.email')
        } else if (input == 'password') {
          this.error.password = this.$t('error.login.password')
        }
      } else {
        this.error.login = null
        this.error.password = null
      }
    },
    async accountLogin(e: Event) {
      const auth = useAuth()
      if (auth?.login) {
        try {
          const res = await auth?.login(this.login, this.password)
          if (res == true) {
            navigateTo({ path: `/account` })
          }
        } catch (e) {
          console.error(e)
          notifications.addError(this.t$('error.login.unable_to_login'))
        }
      }
    }
  }
})
</script>
