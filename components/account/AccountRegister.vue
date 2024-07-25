<template>
  <div v-if="auth?.type=='credentials'" >
    <slot name="register-thankyou">
      <div v-if="accountIsCreated" class="message">
        <div class="message__container">
          <div class="icon-wrapper">
            <icon name="ic:outline-email" class="icon-wrapper__icon"> </icon>
          </div>
          <div class="text-content">
            {{ $t('account.register.notification_registration_thankyou') }}
          </div>
          <div>
            {{ $t('account.register.notification_email_sent') }}
          </div>
        </div>
      </div>
    </slot>
    <div v-if="!accountIsCreated" class="register">
      <slot name="register-catchphrases">
        <div class="register__catchphrases-wrapper">
          <div class="wrapper-stye">
            <div class="logo">
              <logo></logo>
            </div>
            <h2 class="title">
              {{ $t('account.register.title') }}
            </h2>
            <ul class="catchphrases-list">
              <h3 class="catchphrases-list__title">
                {{ $t('account.register.advantages') }}
              </h3>
              <li class="catchphrases-list__item">
                <icon name="check" class="item-icon" />
                <p class="item-text">
                  {{ $t('account.register.advantage_1') }}
                </p>
              </li>
              <li class="catchphrases-list__item">
                <icon name="check" class="item-icon" />
                <p class="item-text">
                  {{ $t('account.register.advantage_2') }}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </slot>
      <slot name="register-form">
        <div class="register__form-wrapper">
          <form class="" @submit.prevent="createAccount">
            <div class="form-control  max-md:col-span-2">
              <label class="label required">
                <span class="label-text">
                  {{ $t('account.address.firstname') }}
                </span>
              </label>
              <input
                v-model="firstname"
                :disabled="loading"
                type="text"
                required
                :placeholder="$t('account.address.firstname')"
                class="input-bordered input w-full "
              />
            </div>
            <div class="form-control max-md:col-span-2">
              <label class="label required">
                <span class="label-text">
                  {{ $t('account.address.lastname') }}
                </span>
              </label>
              <input
                v-model="lastname"
                :disabled="loading"
                type="text"
                required
                class="input-bordered input w-full"
              />
            </div>
            <div class="form-control  w-full col-span-2">
              <label class="label required">
                <span class="label-text">
                  {{ $t('account.address.email') }}
                </span>
              </label>
              <input
                v-model="email"
                :disabled="loading"
                type="email"
                required
                class="input-bordered input w-full"
              />
            </div>
            <div class="form-control w-full col-span-2">
              <label class="label required">
                <span class="label-text">
                  {{ $t('account.login.password') }}
                </span>
              </label>
              <input
                v-model="password"
                :disabled="loading"
                type="password"
                required
                class="input-bordered input w-full"
                minlength="6"
              />
              <div class="label">
                <span class="label-text-alt">
                  {{ $t('account.login.password_requirements') }}
                </span>
              </div>
            </div>
            <div class="form-control col-span-2">
              <label class="label required flex justify-start gap-3">
                <input
                  v-model="legals"
                  :disabled="loading"
                  type="checkbox"
                  required
                  class="checkbox"
                />
                <div class="label-text inline flex-1">
                  {{ $t('account.register.accept_terms') }}
                  <nuxt-link class="underline" :to="legalsLink">
                    {{ $t('account.register.terms_conditions') }}
                  </nuxt-link>
                </div>
              </label>
            </div>
            <div class="flex justify-center py-4 w-full col-span-2">
              <button
                :readonly="!legals || loading"
                type="submit"
                class="btn btn-primary"
              >
                <span v-if="loading" class="loading loading-spinner"></span>
                {{ $t('account.register.sign_up') }}
              </button>

            </div>
            <div v-if="error" class="flex justify-center py-4 w-full col-span-2 text-error">
                {{ error }}
              </div>
          </form>
        </div>
      </slot>
      <slot name="register-footer">
        <div class="register__footer">
          <p class="footer-text">
            <span>{{ $t('account.register.already_have_account') }}</span
            ><nuxt-link
              :to="localePath('/account/login')"
              class="footer-text__link"
            >
              {{ $t('account.login.sign_in') }}
            </nuxt-link>
          </p>
        </div>
      </slot>
    </div>
  </div>
</template>
<script lang="ts">
import LogoVue from '../global/Logo.vue'
import { User } from '~/models'
export default {
  name: 'AccountRegister',
  props: {
    legalsLink: {
      type: String,
      required: false,
      default: '/legals'
    }
  },
  components: {
    logo: LogoVue
  },
  setup() {
    const localePath = useLocalePath()
    const auth = useShopinvaderService('auth')
    return {
      localePath,
      auth
    }
  },
  data() {
    return {
      legals: false as boolean,
      loading: false as boolean,
      error: '' as string,
      password: '' as string,
      email: '' as string,
      firstname: '' as string,
      lastname: '' as string,
      accountIsCreated: false as boolean
    }
  },
  methods: {
    async createAccount() {
      this.loading = true
      const auth = useShopinvaderService('auth')
      const notifications = useNotification()
      try {
        await auth.registerUser(this.firstname +' '+this.lastname, this.password, this.email)
        // Display success message
        this.accountIsCreated = true
      } catch (e) {
        console.error(e)
        this.error = this.$t('error.login.unable_to_login')
        notifications.addError(this.$t('error.login.unable_to_login'))
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
<style lang="scss">
.message {
  @apply my-8 flex flex-wrap md:items-center;

  &__container {
    @apply w-full rounded-3xl bg-gray-100 px-8 py-20 text-center lg:px-20;
    .icon-wrapper {
      @apply pb-6 text-center;

      &__icon {
        @apply inline rounded-full bg-success p-1 text-4xl text-white;
      }
    }
    .text-content {
      @apply text-lg font-bold;
    }
  }
}
.register {
  @apply py-8 flex flex-wrap;
  &__catchphrases-wrapper {
    @apply w-full md:w-1/2 ;
    .wrapper-stye {
      @apply rounded-3xl md:rounded-r-none bg-gray-100 px-8 py-20 lg:px-20;
      .logo {
        @apply flex justify-start pb-4;
      }
      .title {
        @apply mb-20 text-4xl font-black text-gray-900 md:mb-40 md:text-5xl;
      }
      .catchphrases-list {
        @apply max-w-xs;
        &__title {
          @apply mb-6 text-xl font-bold text-gray-500;
        }
        &__item {
          @apply mb-6 flex flex-wrap;
          .item-icon {
            @apply mr-2 h-5 w-5 rounded-full bg-success p-1 text-white;
          }
          .item-text {
            @apply flex-1 font-bold;
          }
        }
      }
    }
  }
  &__form-wrapper {
    @apply w-full lg:p-8 md:w-1/2 card card-body md:rounded-l-none bg-white;
    form {
      @apply grid grid-cols-2 mx-auto lg:px-16 gap-2;
    }
  }
  &__footer {
    @apply w-full p-3;
    .footer-text {
      @apply text-center font-bold text-gray-600;
      &__link {
        @apply ml-2 cursor-pointer font-bold text-secondary hover:text-primary;
      }
    }
  }
}
</style>
