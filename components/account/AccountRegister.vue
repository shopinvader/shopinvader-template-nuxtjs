<template>
  <div>
    <slot name="register-thankyou">
      <div v-if="accountIsCreated" class="message">
        <div class="message__container">
          <div class="icon-wrapper">
            <icon icon="ic:outline-email" class="icon-wrapper__icon"> </icon>
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
                <icon icon="mdi:check" class="item-icon" />
                <p class="item-text">
                  {{ $t('account.register.advantage_1') }}
                </p>
              </li>
              <li class="catchphrases-list__item">
                <icon icon="mdi:check" class="item-icon" />
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
            <div class="input-container">
              <div class="input-container__wrapper">
                <label class="" for="firstname">{{
                  $t('account.address.name')
                }}</label>
                <input
                  class=""
                  id="firstname"
                  v-model="name"
                  name="firstname"
                  type="text"
                  required
                  :placeholder="$t('account.address.name')"
                />
              </div>
              <div class="input-container__wrapper">
                <label class="" for="email">{{
                  $t('account.address.email')
                }}</label>
                <input
                  v-model="email"
                  class=""
                  id="email"
                  type="email"
                  required
                  :placeholder="$t('account.address.email')"
                />
              </div>
              <div class="input-container__wrapper">
                <label class="" for="password">{{
                  $t('account.login.password')
                }}</label>
                <input
                  v-model="password"
                  class=""
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="***************"
                />
              </div>
              <div class="input-container__wrapper">
                <div class="checkbox-container">
                  <div class="checkbox-container__outer">
                    <div class="checkbox-content">
                      <input type="checkbox" class="" />
                      <label
                        class="font-bold text-gray-500"
                        for="signUpLightReverseCheckbox1-1"
                        ><span> {{ $t('account.register.accept_terms') }} </span
                        ><a class="content-link" href="#">
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
                    <button type="submit" class="btn-primary btn w-full">
                      {{ $t('account.register.sign_up') }}
                    </button>
                  </div>
                </div>
              </div>
              <div v-if="error" class="text-error">
                {{ error }}
              </div>
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
  components: {
    logo: LogoVue
  },
  setup() {
    const localePath = useLocalePath()
    return {
      localePath
    }
  },
  data() {
    return {
      error: '' as string,
      password: '' as string,
      email: '' as string,
      name: '' as string,
      accountIsCreated: false as boolean
    }
  },
  methods: {
    async createAccount() {
      const auth = useShopinvaderService('auth')
      const notifications = useNotification()
      try {
        await auth.registerUser(this.name, this.password, this.email)
        // Display success message
        this.accountIsCreated = true
      } catch (e) {
        console.error(e)
        this.error = this.$t('error.login.unable_to_login')
        notifications.addError(this.$t('error.login.unable_to_login'))
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
  @apply -m-8 flex flex-wrap md:items-center;
  &__catchphrases-wrapper {
    @apply w-full p-8 md:w-1/2;
    .wrapper-stye {
      @apply rounded-3xl bg-gray-100 px-8 py-20 lg:px-20;
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
    @apply w-full p-8 md:w-1/2;
    form {
      @apply mx-auto md:max-w-md;

      .input-container {
        @apply -m-3 flex flex-wrap;
        &__wrapper {
          @apply w-full p-3;
          label {
            @apply mb-2 block text-sm font-bold text-gray-500;
          }
          input {
            @apply w-full appearance-none rounded-full border border-gray-200 bg-gray-100 px-6 py-3.5 text-lg font-bold text-gray-500 placeholder-gray-500 outline-none focus:ring-4 focus:ring-gray-300;
          }
          .checkbox-container {
            @apply -m-3 flex flex-wrap items-center justify-between;
            &__outer {
              @apply form-control w-auto p-3;
              .checkbox-content {
                @apply flex items-center;
                input {
                  @apply checkbox-success checkbox checkbox-sm mr-4;
                }
                label {
                  @apply font-bold text-gray-500;
                  .content-link {
                    @apply text-secondary hover:text-primary;
                  }
                }
              }
            }
          }
        }
      }
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
