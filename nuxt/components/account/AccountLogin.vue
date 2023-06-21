<template>
  <div>
    <slot name="head">
      <div class="login-heading">
        <h2 class="login-heading__title">
          {{ $t('account.login.welcome_back') }}
        </h2>
        <p class="login-heading__description">
          {{ $t('account.login.description') }}
        </p>
      </div>
    </slot>
    <form @submit.prevent="submit">
      <div class="subscription-form">
        <div class="subscription-form__row">
          <label class="" for="email">{{ $t('account.address.email') }}</label>
          <input
            id="email"
            v-model="login"
            class=""
            type="email"
            @keyup="checkValidity('login', $event)"
            required
            placeholder="Enter email address"
          />
        </div>
        <div class="subscription-form__error" v-if="error.login">
          {{ error.login }}
        </div>

        <div class="subscription-form__row">
          <label class="" for="password">{{
            $t('account.login.password')
          }}</label>
          <div class="pswd-container">
            <div class="pswd-container__wrapper">
              <div class="pswd-input">
                <input
                  id="password"
                  v-model="password"
                  @keyup="checkValidity('password', $event)"
                  class=""
                  required
                  type="password"
                  placeholder="*************"
                />
              </div>
              <div class="pswd-forgot">
                <NuxtLink
                  class="pswd-forgot__link"
                  :to="localePath('/account/password-reset')"
                  >{{ $t('account.login.forgot_password') }}
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
        <div class="subscription-form__error" v-if="error.password">
          {{ error.password }}
        </div>
        <div class="w-full p-3">
          <div class="subscription-form__error" v-if="error.auth">
            {{ error.auth }}
          </div>
          <div class="subscription-btn">
            <div class="subscription-btn__wrapper">
              <button type="submit" class="">
                {{ $t('account.login.sign_in') }}
              </button>
            </div>
          </div>
        </div>
        <div class="w-full p-3">
          <slot name="footer">
            <p class="footer-content">
              <span class="footer-content__text">
                {{ $t('account.login.not_yet_account') }}
              </span>
              <nuxt-link
                class="footer-content__link"
                :to="localePath('/account/register')"
              >
                {{ $t('account.login.create_account') }}
              </nuxt-link>
            </p>
          </slot>
        </div>
      </div>
    </form>
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
      login: '' as string | null,
      password: '' as string | null,
      error: {
        auth: null as string | null,
        login: null as string | null,
        password: null as string | null
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
      if (e.target?.validity?.valid == false) {
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
    async submit(e: Event) {
      console.log('submit', e)
      const auth = useShopinvaderService('auth')
      if (this?.login && this?.password) {
        try {
          await auth?.login(this.login, this.password)
          this.$emit('success')
        } catch (e) {
          console.error(e)
          this.error.auth = e?.message || this.t$('error.login.unable_to_login')
        }
      }
    }
  }
})
</script>
<style lang="scss">
.login-heading {
  @apply mb-10 text-center;
  &__title {
    @apply mb-4 text-4xl font-black tracking-tight text-black md:text-5xl;
  }
  &__description {
    @apply font-bold text-gray-500;
  }
}
.subscription-form {
  @apply -m-3 flex flex-wrap;
  &__row {
    @apply w-full p-3;
    label {
      @apply mb-2 block text-sm font-bold text-gray-500;
    }
    input {
      @apply w-full appearance-none rounded-full border border-gray-100 bg-gray-100 px-6 py-3.5 text-lg font-bold text-gray-500 placeholder-gray-500 outline-none focus:ring-4 focus:ring-secondary;
    }
    .pswd-container {
      @apply overflow-hidden rounded-full border border-gray-200 focus-within:ring-4 focus-within:ring-secondary;
      &__wrapper {
        @apply flex flex-wrap;
        .pswd-input {
          @apply flex-1 bg-gray-100;
          input {
            @apply w-full appearance-none bg-gray-100 px-6 py-3.5 text-lg font-bold text-gray-500 placeholder-gray-500 outline-none focus:border-2 focus:outline-0 focus:ring-transparent;
          }
        }
        .pswd-forgot {
          @apply w-auto;
          &__link {
            @apply flex h-full items-center bg-gray-100 pr-4 font-bold text-secondary hover:text-primary;
          }
        }
      }
    }
  }
  &__error {
    @apply pl-4 text-sm italic text-red-500;
  }

  .subscription-btn {
    @apply -m-2 flex flex-wrap md:justify-end;
    &__wrapper {
      @apply w-full p-2;
      button {
        @apply block w-full rounded-full bg-primary px-8 py-3.5 text-center text-lg font-bold text-white hover:bg-secondary focus:ring-2 focus:ring-primary;
      }
    }
  }
  .footer-content {
    @apply text-center font-bold text-gray-600;
    &__text {
      @apply mr-2;
    }
    &__link {
      @apply cursor-pointer font-bold text-secondary hover:text-primary;
    }
  }
}
</style>
