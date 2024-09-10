<template>
  <div v-if="auth?.type == 'credentials'">
    <slot name="head">
      <div class="reset-heading">
        <h2 class="reset-heading__title">
          {{ $t('account.reset.set_new_pswd_title') }}
        </h2>
        <p class="reset-heading__description">
          {{ $t('account.reset.set_new_pswd_description') }}
        </p>
      </div>
    </slot>
    <form @submit.prevent="submit">
      <div class="reset-form">
        <div class="reset-form__row">
          <label class="" for="newPassword">
            {{ $t('account.reset.new_password') }}
          </label>
          <div class="pswd-container">
            <div class="pswd-container__wrapper">
              <div class="pswd-input">
                <input
                  id="newPassword"
                  v-model="newPassword"
                  class=""
                  required
                  :disabled="loading"
                  :type="newPasswordView ? 'text' : 'password'"
                  :placeholder="newPasswordView ? '' : '*************'"
                />
              </div>
              <div class="pswd-view">
                <button
                  type="button"
                  @click="newPasswordView = !newPasswordView"
                  class="btn btn-link"
                >
                  <icon class="view-icon" :name="newPasswordView ? 'view' : 'hide'" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="reset-form__row">
          <label class="" for="repeatNewPassword">
            {{ $t('account.reset.repeat_new_password') }}
          </label>
          <div class="pswd-container">
            <div class="pswd-container__wrapper">
              <div class="pswd-input">
                <input
                  id="repeatNewPassword"
                  v-model="repeatNewPassword"
                  @keyup="checkValidity()"
                  class=""
                  required
                  :disabled="loading"
                  :type="repeatPasswordView ? 'text' : 'password'"
                  :placeholder="repeatPasswordView ? '' : '*************'"
                />
              </div>
              <div class="pswd-view">
                <button
                  type="button"
                  @click="repeatPasswordView = !repeatPasswordView"
                  class="btn btn-link"
                >
                  <icon class="view-icon" :name="repeatPasswordView ? 'view' : 'hide'" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="reset-form__error" v-if="error.newPassword">
          {{ error.newPassword }}
        </div>
        <div class="w-full p-3">
          <div class="reset-btn">
            <div class="reset-btn__wrapper">
              <button type="submit" class="" :disabled="loading">
                <span v-if="loading" class="loading loading-spinner"></span>
                {{ $t('actions.validate') }}
              </button>
            </div>
          </div>
        </div>
        <div class="w-full p-3">
          <slot name="footer">
            <div class="footer-success" v-if="successMessage">
              {{ $t('account.reset.set_new_pswd_success') }}
              <div>
                <nuxt-link :to="localePath('/account/login')" class="btn btn-link">
                  {{ $t('account.reset.set_new_pswd_success_link') }}
                  <icon name="right" />
                </nuxt-link>
              </div>
            </div>
            <div class="footer-error" v-if="error.auth">
              {{ error.auth }}
            </div>
          </slot>
        </div>
      </div>
    </form>
  </div>
</template>
<script lang="ts">
import type { AuthCredentialService } from '#services'
import LogoVue from '../global/Logo.vue'

export default defineNuxtComponent({
  name: 'AccountSetNewPassword',
  components: {
    logo: LogoVue
  },
  data() {
    return {
      newPasswordView: false as boolean,
      repeatPasswordView: false as boolean,
      successMessage: false as boolean,
      newPassword: null as string | null,
      repeatNewPassword: null as string | null,
      token: null as string | null,
      loading: false as boolean,
      error: {
        auth: null as string | null,
        newPassword: null as string | null
      }
    }
  },
  setup() {
    const route = useRoute()
    const localePath = useLocalePath()
    const auth = useShopinvaderService('auth') as unknown as AuthCredentialService
    return {
      localePath,
      auth,
      route
    }
  },

  methods: {
    checkValidity() {
      if (this.route.query.token) {
        this.token = this.route.query.token as string
      }
      this.error.newPassword = null
      if (this.newPassword !== this.repeatNewPassword) {
        this.error.newPassword = this.$t('error.reset.pasword_missmatch')
      } else {
        this.error.newPassword = null
      }
    },
    async submit(_e: Event) {
      const auth = this.auth
      this.loading = true
      if (this?.token && this?.newPassword) {
        try {
          await auth?.setPassword(this.token, this.newPassword)
          this.successMessage = true
        } catch (e: any) {
          console.error(e)
          this.error.auth = e?.message || this.$t('error.login.unable_to_login')
        }
        this.loading = false
      } else {
        this.error.newPassword = this.$t('error.reset.pswd_something_wrong')
        this.loading = false
      }
    }
  }
})
</script>
<style lang="scss">
.reset-heading {
  @apply mb-10 text-center;
  &__title {
    @apply mb-4 text-4xl font-black tracking-tight text-black md:text-5xl;
  }
  &__description {
    @apply font-bold text-gray-500;
  }
}
.reset-form {
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
        @apply flex flex-wrap;
        .pswd-input {
          @apply flex-1 bg-gray-100;
          input {
            @apply w-full appearance-none bg-gray-100 px-6 py-3.5 text-lg font-bold text-gray-500 placeholder-gray-500 outline-none focus:border-2 focus:outline-0 focus:ring-transparent active:bg-inherit;
          }
        }
        .pswd-view {
          @apply flex items-center justify-center bg-gray-100;
          .view-icon {
            @apply text-2xl text-gray-500;
          }
        }
      }
    }
  }
  &__error {
    @apply pl-4 text-sm italic text-red-500;
  }

  .reset-btn {
    @apply -m-2 flex flex-wrap md:justify-end;
    &__wrapper {
      @apply w-full p-2;
      button {
        @apply block w-full rounded-full bg-primary px-8 py-3.5 text-center text-lg font-bold text-white hover:bg-secondary focus:ring-2 focus:ring-primary;
      }
    }
  }
  .footer-success {
    @apply rounded-3xl border border-success p-4 text-center text-gray-600;
  }
  .footer-error {
    @apply rounded-3xl border border-error p-4 text-center text-gray-600;
  }
}
</style>
