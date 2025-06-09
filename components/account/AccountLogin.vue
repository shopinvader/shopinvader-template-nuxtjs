<template>
  <div v-if="auth?.type == 'credentials'" class="account-login">
    <slot name="head">
      <div class="account-login__heading">
        <h2 class="heading__title">
          {{ t('account.login.welcome_back') }}
        </h2>
        <p class="heading__description">
          {{ t('account.login.description') }}
        </p>
      </div>
    </slot>
    <form @submit.prevent="submit" class="account-login__form">
      <label class="form__control control-login">
        <div class="label">
          <span class="label-text">
            {{ t('account.address.email') }}
          </span>
        </div>
        <input
          type="email"
          v-model="login"
          class="control__input"
          required
          :placeholder="t('account.address.email')"
        />
      </label>
      <input-password
        v-model="password"
        :required="true"
        placeholder="***********"
        :disabled="loading"
        pattern=".{6,}"
      >
        <template #label>
          {{ t('account.login.password') }}
        </template>
        <template #error><span></span></template>
        <template #label-bottom>
          <nuxt-link
            class="label-text-alt underline"
            :to="{
              path: localePath('/account/password-reset'),
              query: { login }
            }"
          >
            {{ t('account.login.forgot_password') }}
          </nuxt-link>
        </template>
      </input-password>
      <div class="form__submit">
        <button type="submit" class="submit__btn" :disabled="loading">
          <span v-if="loading" class="loading loading-spinner"></span>
          {{ t('account.login.sign_in') }}
        </button>
        <div v-if="error" class="submit__error">
          <icon class="w-12" name="error" />
          {{ error }}
        </div>
      </div>
    </form>
    <div class="account-login__footer">
      <slot name="footer">
        <p class="footer-content">
          <span class="footer-content__text">
            {{ t('account.login.not_yet_account') }}
          </span>
          <nuxt-link class="footer-content__link" :to="localePath('/account/register')">
            {{ t('account.login.create_account') }}
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
<script lang="ts" setup>
import type { AuthCredentialService } from '#services'
import { erpApiGetErrorMessagesAsStr } from '~/utils/ErpApiHelper'

const localePath = useLocalePath()
const auth = useShopinvaderService('auth') as AuthCredentialService | null

const emit = defineEmits(['success'])
const { t } = useI18n()
const login = ref<string>('')
const password = ref<string>('')
const loading = ref<boolean>(false)
const error = ref<string | null>(null)

onMounted(async () => {
  if (!auth?.getUser()?.value && auth?.type == 'oidc') {
    const url = useRequestURL()
    await auth?.loginRedirect(url?.href)
  }
})

/*
 * Submit the login form
 */
const submit = async (_e: Event) => {
  loading.value = true
  error.value = null

  try {
    login.value = login.value?.trim()
    if (!login.value || !password.value) {
      throw new Error(t('error.login.unable_to_login'))
    }
    const user = await auth?.login(login.value, password.value)
    if (!user) {
      // Null user means login failed
      error.value = t('error.login.unable_to_login')
    } else {
      emit('success')
    }
  } catch (e) {
    // Display the error message
    error.value = erpApiGetErrorMessagesAsStr(e) || t('error.generic')
  } finally {
    loading.value = false
  }
}
</script>
<style>
@reference "@/assets/css/main.css";

.account-login {
  @apply flex max-w-sm flex-col;
  &__form {
    @apply card card-body  rounded-b-none bg-white;
    .form {
      &__control {
        @apply form-control w-full max-w-xs;
        .control {
          &__input {
            @apply input  w-full max-w-xs;
          }
        }
        &.control-password {
          .control__input {
            @apply flex items-center gap-2;
          }
        }
      }
      .form__control {
        &.control-password {
          .control {
            &__input {
              @apply items-center gap-2;
            }
          }
        }
      }
      &__submit {
        @apply flex flex-col justify-center;
        .submit {
          &__error {
            @apply flex items-start justify-center gap-1 py-4 text-error;
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
    @apply card card-body rounded-t-none bg-primary-800 text-primary-content;
    .footer-content {
      @apply flex flex-col items-center justify-center gap-2;
      &__text {
        @apply text-lg;
      }
      &__link {
        @apply btn btn-sm bg-white;
      }
    }
  }
}
</style>
