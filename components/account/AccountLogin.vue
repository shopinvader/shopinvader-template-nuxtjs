<template>
  <div v-if="auth?.type=='credentials'">
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
            :disabled="loading"
          />
        </div>
        <div class="subscription-form__error" v-if="error.login">
          {{ error.login }}
        </div>

        <div class="subscription-form__row">
          <label class="" for="password">
            {{ $t('account.login.password') }}
          </label>
          <div class="pswd-container">
            <div class="pswd-container__wrapper">
              <div class="pswd-input">
                <input
                  id="password"
                  v-model="password"
                  @keyup="checkValidity('password', $event)"
                  class=""
                  required
                  :disabled="loading"
                  :type="passwordView ? 'text' : 'password'"
                  :placeholder="passwordView ? '' : '*************'"
                />
              </div>
              <div class="pswd-view">
                <button type="button" @click="passwordView = !passwordView" class="btn btn-link">
                  <icon
                    class="view-icon"
                    :icon="passwordView ? 'clarity:eye-line': 'clarity:eye-hide-line'"
                  />
                </button>
              </div>
            </div>
          </div>
          <div class="pswd-forgot">
            <NuxtLink
              class="pswd-forgot__link"
              :to="localePath('/account/password-reset')"
              >{{ $t('account.login.forgot_password') }}
            </NuxtLink>
          </div>
        </div>
        <div v-if="error.password" class="subscription-form__error" >
          {{ error.password }}
        </div>
        <div class="w-full p-3">
          <div class="subscription-form__error" >
            <template v-if="error.auth">
              <icon class="text-xl" icon="clarity:error-line" />
              {{ error.auth }}
            </template>
          </div>
          <div class="subscription-btn">
            <div class="subscription-btn__wrapper">
              <button type="submit" class="btn" :disabled="loading">
                <span v-if="loading" class="loading loading-spinner"></span>
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
import { AuthCredentialService } from '~/services/auth'
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
      passwordView: false as boolean,
      loading: false as boolean,
      error: {
        auth: null as string | null,
        login: null as string | null,
        password: null as string | null
      }
    }
  },
  setup() {
    const localePath = useLocalePath()
    const auth = useShopinvaderService('auth') as AuthCredentialService
    return {
      localePath,
      auth
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
      const auth = this.auth
      this.loading = true
      if (this?.login && this?.password) {
        try {
          await auth?.login(this.login, this.password)
          this.$emit('success')
        } catch (e) {
          this.error.auth = this.$t('error.login.unable_to_login')
        } finally {
          this.loading = false
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
    @apply w-full p-3 pb-0;
    label {
      @apply mb-2 block text-sm font-bold text-gray-500;
    }
    input {
      @apply w-full appearance-none rounded-full border border-gray-100 bg-gray-100 px-6 py-3.5 text-lg font-bold text-gray-500 placeholder-gray-500 outline-none focus:ring-4 focus:ring-secondary;
    }
    .pswd-container {
      @apply overflow-hidden rounded-full border border-gray-200 focus-within:ring-4 focus-within:ring-secondary;
      &__wrapper {
        @apply flex flex-wrap ;
        .pswd-input {
          @apply flex-1 bg-gray-100;
          input {
            @apply w-full appearance-none bg-gray-100 px-6 py-3.5 text-lg font-bold text-gray-500 placeholder-gray-500 outline-none focus:border-2 focus:outline-0 focus:ring-transparent active:bg-inherit;
          }
        }
        .pswd-view {
          @apply bg-gray-100 flex justify-center items-center;
          .view-icon {
            @apply  text-2xl text-gray-500;
          }
        }

      }
    }
    .pswd-forgot {
      &__link {
        @apply btn btn-link btn-xs;
      }
    }
  }
  &__error {
    @apply text-error mb-3 min-h-6 flex gap-1 items-center;
  }

  .subscription-btn {
    @apply -m-2 flex flex-wrap md:justify-end;
    &__wrapper {
      @apply w-full p-2;
      button {
        @apply btn btn-primary btn-lg w-full rounded-full;
        //@apply block w-full rounded-full bg-primary px-8 py-3.5 text-center text-lg font-bold text-white hover:bg-secondary focus:ring-2 focus:ring-primary;
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
