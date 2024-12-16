<template>
  <div v-if="auth?.type == 'credentials'">
    <slot name="register-thankyou">
      <div v-if="accountIsCreated" class="message">
        <div class="message__container">
          <div class="icon-wrapper">
            <icon name="email" class="icon-wrapper__icon"> </icon>
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
            <div class="form-control max-md:col-span-2">
              <label class="required label">
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
                class="input input-bordered w-full"
              />
            </div>
            <div class="form-control max-md:col-span-2">
              <label class="required label">
                <span class="label-text">
                  {{ $t('account.address.lastname') }}
                </span>
              </label>
              <input
                v-model="lastname"
                :disabled="loading"
                type="text"
                required
                :placeholder="$t('account.address.lastname')"
                class="input input-bordered w-full"
              />
            </div>
            <div class="form-control col-span-2 w-full">
              <label class="required label">
                <span class="label-text">
                  {{ $t('account.address.email') }}
                </span>
              </label>
              <input
                v-model="login"
                :disabled="loading"
                type="email"
                required
                :placeholder="$t('account.address.email')"
                class="input input-bordered w-full"
                :class="{ 'input-bordered-error': fieldError.login }"
                @keyup="checkValidity('login', $event)"
              />
              <div class="label">
                <span v-if="fieldError.login" class="label-text-alt text-error">
                  {{ $t('error.login.email') }}
                </span>
              </div>
            </div>
            <div class="form-control col-span-2 w-full">
              <label class="required label">
                <span class="label-text">
                  {{ $t('account.login.password') }}
                </span>
              </label>
              <div
                class="input input-bordered flex w-full items-center"
                :class="{
                  'input-bordered-error': fieldError.password,
                  'input-disabled': loading
                }"
              >
                <input
                  v-model="password"
                  :readonly="loading"
                  :type="passwordView ? 'text' : 'password'"
                  required
                  :placeholder="passwordView ? '' : '********'"
                  class="grow"
                  minlength="8"
                  pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$%^&+=!?])[A-Za-z\d@#$%^&+=!?]{8,}$"
                  @keyup="checkValidity('password', $event)"
                />
                <button
                  type="button"
                  @click="passwordView = !passwordView"
                  class="cursor-pointer text-lg"
                >
                  <icon class="view-icon" :name="passwordView ? 'view' : 'hide'" />
                </button>
              </div>
              <div class="label">
                <span class="label-text-alt" :class="{ 'text-error': fieldError.password }">
                  {{ $t('account.login.password_requirements') }}
                </span>
              </div>
            </div>
            <div class="form-control col-span-2">
              <label class="required label flex justify-start gap-3">
                <input
                  v-model="legals"
                  :disabled="loading"
                  type="checkbox"
                  required
                  class="checkbox"
                />
                <i18n-t
                  tag="div"
                  keypath="account.register.accept_terms"
                  class="label-text inline flex-1"
                >
                  <template #link>
                    <NuxtLinkLocale :to="legalsLink" class="underline">
                      {{ $t('account.register.terms_conditions') }}
                    </NuxtLinkLocale>
                  </template>
                </i18n-t>
              </label>
            </div>
            <div v-if="error" class="col-span-2 w-full pt-2 text-center text-error">
              {{ $t('error.generic') }}
            </div>
            <div class="col-span-2 flex w-full justify-center py-4">
              <button :readonly="!legals || loading" type="submit" class="btn btn-primary">
                <span v-if="loading" class="loading loading-spinner"></span>
                {{ $t('account.register.sign_up') }}
              </button>
            </div>
          </form>
        </div>
      </slot>
      <slot name="register-footer">
        <div class="register__footer">
          <p class="footer-text">
            <span>{{ $t('account.register.already_have_account') }}</span
            ><nuxt-link :to="localePath('/account/login')" class="footer-text__link">
              {{ $t('account.login.sign_in') }}
            </nuxt-link>
          </p>
        </div>
      </slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
defineProps({
  legalsLink: {
    type: String,
    required: false,
    default: '/legals/privacy'
  }
})
const loading = ref(false)
const firstname = ref('')
const lastname = ref('')
const password = ref('')
const login = ref('')
const accountIsCreated = ref(false)
const passwordView = ref(false)
const legals = ref(false)
const error = ref(false)
const fieldError = ref({
  login: false,
  password: false
})

const localePath = useLocalePath()
const auth = useShopinvaderService('auth')
const checkValidity = (input: 'login' | 'password', e: KeyboardEvent) => {
  const target = e.target as HTMLInputElement
  const validity = target?.checkValidity()
  fieldError.value = {
    ...fieldError.value,
    [input]: !validity || target?.value === ''
  }
}

const createAccount = async () => {
  loading.value = true
  error.value = false
  const auth = useShopinvaderService('auth')
  const notifications = useNotification()
  try {
    if (legals.value === false) {
      return
    }
    await auth.registerUser(firstname.value + ' ' + lastname.value, password.value, login.value)
    // Display success message
    accountIsCreated.value = true
  } catch (e) {
    console.error(e)
    error.value = true
    notifications.addError($t('error.login.unable_to_login'))
  } finally {
    loading.value = false
  }
}
</script>
<style lang="scss">
.message {
  @apply my-8 flex flex-wrap md:items-center;

  &__container {
    @apply w-full rounded-3xl bg-gray-100 px-8 py-20 text-center lg:px-20;
    .icon-wrapper {
      @apply pb-2 text-center;

      &__icon {
        @apply h-16 w-16 rounded-full border bg-success p-1 text-white;
      }
    }
    .text-content {
      @apply text-lg font-bold;
    }
  }
}
.register {
  @apply flex flex-wrap py-8;
  &__catchphrases-wrapper {
    @apply w-full md:w-1/2;
    .wrapper-stye {
      @apply rounded-3xl bg-gray-100 px-8 py-20 md:rounded-r-none lg:px-20;
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
    @apply card card-body w-full bg-white md:w-1/2 md:rounded-l-none lg:p-8;
    form {
      @apply mx-auto grid grid-cols-2 gap-2 lg:px-16;
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
