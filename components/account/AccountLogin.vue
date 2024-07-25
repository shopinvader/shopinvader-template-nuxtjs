<template>
  <div
    v-if="auth?.type=='credentials'"
    class="account-login">
    <slot name="head">
      <div class="account-login__heading">
        <h2 class="heading__title">
          {{ $t('account.login.welcome_back') }}
        </h2>
        <p class="heading__description">
          {{ $t('account.login.description') }}
        </p>
      </div>
    </slot>
    <form @submit.prevent="submit" class="account-login__form">
      <label class="form__control control-login">
        <div class="label">
          <span class="label-text">
            {{ $t('account.address.email') }}
          </span>
        </div>
        <input type="email" v-model="login" class="control__input" @keyup="checkValidity('email', $event)" :placeholder="$t('account.address.email')" />
        <div class="label">
          <span v-if="error.login" class="label-text-alt text-error">{{ error.login }}</span>
        </div>
      </label>
      <label class="form__control control-password">
        <div class="label">
          <span class="label-text">
             {{ $t('account.login.password') }}
          </span>
        </div>
        <label class="control__input">
          <input
            v-model="password"
            :type="passwordView ? 'text' : 'password'"
            :disabled="loading"
            required
            class="grow"
            minlength="6"
            :placeholder="passwordView ? '' : '*************'"
            @keyup="checkValidity('password', $event)"
          />
          <button type="button" @click="passwordView = !passwordView" class="cursor-pointer text-lg">
            <icon
              class="view-icon"
              :name="passwordView ? 'view': 'hide'"
            />
          </button>
        </label>
        <div class="label">
          <span v-if="error.password" class="label-text-alt text-error">{{ error.password }}</span>
        </div>
        <div class="label">
          <NuxtLink
            class="label-text-alt underline"
            :to="localePath('/account/password-reset')"
            >{{ $t('account.login.forgot_password') }}
          </NuxtLink>
        </div>

      </label>
      <div class="form__submit">
        <div v-if="error.auth" class="submit__error" >
          <icon class="text-xl" name="error" />
            {{ error.auth }}
        </div>
        <button type="submit" class="submit__btn " :disabled="loading">
          <span v-if="loading" class="loading loading-spinner"></span>
          {{ $t('account.login.sign_in') }}
        </button>
      </div>

    </form>
    <div class="account-login__footer">
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
  <div v-else>
    <div v-if="loading" class="">
      <spinner :size="40"></spinner>
    </div>
  </div>
</template>
<script lang="ts">
import { AuthCredentialService } from '#services'
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
        password: null as string | null,
        message: null as string | null
      }
    }
  },
  setup() {
    const localePath = useLocalePath()
    const auth = useShopinvaderService('auth') as AuthCredentialService
    onMounted(async () => {
      if(!auth?.getUser()?.value && auth?.type == 'oidc') {
        const url = useRequestURL()
        await auth?.loginRedirect(url?.href)
      }
    })
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
.account-login {
  @apply flex flex-col max-w-sm;
  &__form {

    @apply card card-body card-bordered rounded-b-none bg-white;
    .form {
      &__control {

        @apply form-control w-full max-w-xs;
        .control {
          &__input {
            @apply input input-bordered w-full max-w-xs;
          }

        }
        &.control-password {
          .control__input{
            @apply flex items-center gap-2;
          }
        }
      }
      .form__control {
        &.control-password {

          .control {
            &__input {
              @apply  items-center gap-2;
            }
          }
        }
      }
      &__submit {
        @apply flex flex-col justify-center;
        .submit {
          &__error {
            @apply text-error py-4 text-center;
          }
          &__btn {
            @apply btn btn-primary btn-block;
          }
        }
      }
    }
  }
  &__heading {
    @apply mb-10 text-center;
    .heading {
      &__title {
        @apply mb-4 text-4xl font-black tracking-tight text-black md:text-5xl;
      }
      &__description {
        @apply font-bold text-gray-500;
      }
    }
  }
  &__footer {
    @apply card card-body bg-primary-800 text-primary-content rounded-t-none;
    .footer-content {
      @apply flex flex-col justify-center items-center gap-2;
      &__text {
        @apply text-lg;
      }
      &__link {
        @apply  btn btn-sm bg-white;
      }
    }
  }
}

</style>
