<template>
  <section
    class="flex h-screen items-center overflow-hidden bg-gradient-to-tr from-gray-400 via-yellow-50 to-gray-400 py-10"
  >
    <div class="container mx-auto px-4">
      <div class="rounded-3xl bg-white p-10">
        <div class="-m-8 flex flex-wrap md:items-center">
          <div class="w-full p-8 md:w-1/2">
            <div class="rounded-3xl bg-gray-100 py-20 px-8 lg:px-20">
              <div class="flex justify-start pb-4">
                <Logo></Logo>
              </div>
              <h2
                class="font-heading mb-20 text-4xl font-black text-gray-900 md:mb-40 md:text-5xl"
              >
                {{ $t('account.register.title') }}
              </h2>
              <ul class="max-w-xs">
                <h3 class="font-heading mb-6 text-xl font-bold text-gray-500">
                  {{ $t('account.register.advantages') }}
                </h3>
                <li class="mb-6 flex flex-wrap">
                  <icon
                    icon="mdi:check"
                    class="mr-2 h-5 w-5 rounded-full bg-success p-1 text-white"
                  />
                  <p class="flex-1 font-bold">
                    {{ $t('account.register.advantage_1') }}
                  </p>
                </li>
                <li class="flex flex-wrap">
                  <icon
                    icon="mdi:check"
                    class="mr-2 h-5 w-5 rounded-full bg-success p-1 text-white"
                  />
                  <p class="flex-1 font-bold">
                    {{ $t('account.register.advantage_2') }}
                  </p>
                </li>
              </ul>
            </div>
          </div>
          <div class="w-full p-8 md:w-1/2">
            <form class="mx-auto md:max-w-md">
              <div class="-m-3 flex flex-wrap">
                <div class="w-full p-3">
                  <label
                    class="mb-2 block text-sm font-bold text-gray-500"
                    for="firstname"
                    >{{ $t('account.address.name') }}</label
                  >
                  <input
                    class="w-full appearance-none rounded-full border border-gray-200 bg-gray-100 px-6 py-3.5 text-lg font-bold text-gray-500 placeholder-gray-500 outline-none focus:ring-4 focus:ring-gray-300"
                    id="firstname"
                    v-model="customer.name"
                    name="firstname"
                    type="text"
                    :placeholder="$t('account.address.name')"
                  />
                </div>
                <div class="w-full p-3">
                  <label
                    class="mb-2 block text-sm font-bold text-gray-500"
                    for="email"
                    >{{ $t('account.address.email') }}</label
                  >
                  <input
                    v-model="customer.email"
                    class="w-full appearance-none rounded-full border border-gray-200 bg-gray-100 px-6 py-3.5 text-lg font-bold text-gray-500 placeholder-gray-500 outline-none focus:ring-4 focus:ring-gray-300"
                    id="email"
                    type="email"
                    :placeholder="$t('account.address.email')"
                  />
                </div>
                <div class="w-full p-3">
                  <label
                    class="mb-2 block text-sm font-bold text-gray-500"
                    for="password"
                    >{{ $t('account.login.password') }}</label
                  >
                  <input
                    v-model="customer.password"
                    class="w-full appearance-none rounded-full border border-gray-200 bg-gray-100 px-6 py-3.5 text-lg font-bold text-gray-500 placeholder-gray-500 outline-none focus:ring-4 focus:ring-gray-300"
                    id="password"
                    name="password"
                    type="password"
                    placeholder="***************"
                  />
                </div>
                <div class="w-full p-3">
                  <div class="-m-3 flex flex-wrap items-center justify-between">
                    <div class="form-control w-auto p-3">
                      <div class="flex items-center">
                        <input
                          type="checkbox"
                          class="checkbox-success checkbox mr-4"
                        />
                        <label
                          class="font-bold text-gray-500"
                          for="signUpLightReverseCheckbox1-1"
                          ><span>
                            {{ $t('account.register.accept_terms') }} </span
                          ><a
                            class="text-secondary hover:text-primary"
                            href="#"
                          >
                            {{ $t('account.register.terms_conditions') }}</a
                          ></label
                        >
                      </div>
                    </div>
                  </div>
                </div>
                <div class="w-full p-3">
                  <div class="-m-2 flex flex-wrap md:justify-end">
                    <div class="w-full p-2">
                      <a
                        class="focus:gray-200 block rounded-full bg-primary px-8 py-3.5 text-center text-lg font-bold text-white hover:bg-secondary focus:ring-4"
                        @click="createAccount"
                        >{{ $t('account.register.sign_up') }}</a
                      >
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="w-full p-3">
            <p class="text-center font-bold text-gray-600">
              <span>{{ $t('account.register.already_have_account') }}</span
              ><nuxt-link
                :to="localePath('/account/login')"
                class="ml-2 cursor-pointer font-bold text-secondary hover:text-primary"
              >
                {{ $t('account.login.sign_in') }}
              </nuxt-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script lang="ts">
import { Address, User } from '~~/models'
export default defineNuxtComponent({
  name: 'AccountRegister',
  components: {
    Logo: 'Logo'
  },
  setup() {
    const localePath = useLocalePath()
    return {
      localePath
    }
  },
  data() {
    return {
      customer: {
        title: 'title_mr' as string,
        name: '' as string,
        password: '' as string,
        zip: '' as string,
        phone: '' as string,
        street: '' as string,
        city: '' as string,
        street2: '' as string,
        country: '' as string,
        email: '' as string,
        optOut: false as boolean
      } as Address | null
    }
  },
  methods: {
    async createAccount() {
      const services = useShopinvaderServices()
      const notifications = useNotification()
      try {
        const userIsLoggedIn = (await services?.auth.registerUser(
          this.customer
        )) as User
        console.log(userIsLoggedIn)
      } catch (e) {
        console.error(e)
        notifications.addError('error login')
      }
    }
  }
})
</script>
