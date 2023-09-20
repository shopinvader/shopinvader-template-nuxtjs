<template>
  <div  v-if="auth?.type=='credentials'">
    <slot name="head">
      <div class="reset-heading">
        <h2 class="reset-heading__title">
          {{ $t('account.reset.reset_pswd') }}
        </h2>
        <p class="reset-heading__description">
          {{ $t('account.reset.description') }}
        </p>
      </div>
    </slot>
    <form @submit.prevent="submit">
      <div class="reset-form">
        <div class="reset-form__row">
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
        <div class="reset-form__error" v-if="error.login">
          {{ error.login }}
        </div>
        <div class="w-full p-3">
          <div class="reset-btn">
            <div class="reset-btn__wrapper">
              <button type="submit" class="">
                {{ $t('account.reset.reset_btn') }}
              </button>
            </div>
          </div>
        </div>
        <div class="w-full p-3">
          <slot name="footer">
            <div class="footer-success" v-if="successMessage">
              {{ $t('account.reset.reset_success') }}
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
import LogoVue from '../global/Logo.vue'

export default defineNuxtComponent({
  name: 'AccountLogin',
  components: {
    logo: LogoVue
  },
  data() {
    return {
      login: '' as string | null,
      successMessage: false as boolean,
      error: {
        auth: null as string | null,
        login: null as string | null
      }
    }
  },
  setup() {
    const localePath = useLocalePath()
    const auth = useShopinvaderService('auth')
    return {
      localePath,
      auth
    }
  },
  methods: {
    checkValidity(input: string, e: Event) {
      this.error.login = null
      if (e.target?.validity?.valid == false) {
        if (input == 'login') {
          this.error.login = this.$t('error.login.email')
        }
      } else {
        this.error.login = null
      }
    },
    async submit(e: Event) {
      const auth = useShopinvaderService('auth')
      if (this?.login) {
        try {
          const resetPasswordSent = (await auth?.resetPassword(
            this.login
          )) as boolean
          if (resetPasswordSent) {
            this.successMessage = true
          }
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
    @apply w-full p-3;
    label {
      @apply mb-2 block text-sm font-bold text-gray-500;
    }
    input {
      @apply w-full appearance-none rounded-full border border-gray-100 bg-gray-100 px-6 py-3.5 text-lg font-bold text-gray-500 placeholder-gray-500 outline-none focus:ring-4 focus:ring-secondary;
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
