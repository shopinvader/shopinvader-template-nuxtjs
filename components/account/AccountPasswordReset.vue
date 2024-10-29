<template>
  <div v-if="auth?.type == 'credentials'">
    <template v-if="!successMessage">
      <slot name="head">
        <div class="reset-heading">
          <h2 class="reset-heading__title">
            {{ t('account.reset.reset_pswd') }}
          </h2>
          <p class="reset-heading__description">
            {{ t('account.reset.description') }}
          </p>
        </div>
      </slot>
      <form @submit.prevent="submit">
        <div class="reset-form">
          <div class="reset-form__row">
            <label class="" for="email">{{ t('account.address.email') }}</label>
            <input
              id="email"
              v-model="login"
              class=""
              type="email"
              @keyup="checkValidity($event)"
              required
              placeholder="Enter email address"
              :disabled="loading"
            />
          </div>
          <div class="reset-form__error">
            <slot name="error" :error="error" :loading="loading">
              <div class="" v-if="error.auth">
                {{ error.auth }}
              </div>
            </slot>
          </div>
          <div class="w-full p-3">
            <div class="reset-btn">
              <div class="reset-btn__wrapper">
                <button type="submit" class="" :disabled="loading">
                  <span v-if="loading" class="loading loading-spinner"></span>
                  {{ t('account.reset.reset_btn') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </template>
    <div v-else class="reset-success">
      <slot name="success">
        <h2 class="reset-success__title">
          {{ t('account.reset.reset_pswd') }}
        </h2>
        {{ t('account.reset.reset_success') }}
        <div>
          <nuxt-link :to="localePath('account')" class="btn btn-primary">
            <icon name="left" />
            {{ t('btn.back') }}
          </nuxt-link>
        </div>
      </slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { AuthCredentialService } from '#services'
const { t } = useI18n()
const login = ref('')
const successMessage = ref(false)
const error = reactive({
  auth: null as string | null,
  login: false
})
const localePath = useLocalePath()
const auth = useShopinvaderService('auth') as AuthCredentialService
const route = useRoute()
const loading = ref(false)
onMounted(() => {
  login.value = route?.query?.login?.toString() || ''
})

const checkValidity = (e: KeyboardEvent) => {
  const target = e.target as HTMLInputElement
  const validity = target?.checkValidity()
  error.login = !validity || target?.value === ''
}

const submit = async (e: Event) => {
  const auth = useShopinvaderService('auth') as AuthCredentialService
  loading.value = true
  if (login.value) {
    error.auth = null
    try {
      const resetPasswordSent = (await auth?.resetPassword(login.value)) as boolean
      if (resetPasswordSent) {
        successMessage.value = true
      }
      login.value = ''
    } catch (e: any) {
      console.error(e)
      const msg = erpApiGetErrorMessagesAsStr(e.data)
      error.auth = msg || t('error.generic')
    } finally {
      loading.value = false
    }
  }
}
</script>
<style lang="scss">
.reset-heading {
  @apply mb-10 text-center;
  &__title {
    @apply mb-4 text-2xl tracking-tight text-black md:text-4xl;
  }
  &__description {
    @apply text-gray-500;
  }
}
.reset-form {
  @apply flex flex-wrap justify-center;
  &__row {
    @apply form-control w-full max-w-md;
    label {
      @apply label;
    }
    input {
      @apply input input-bordered w-full;
    }
  }
  &__error {
    @apply py-3 pl-4 text-left text-sm text-error;
  }

  .reset-btn {
    @apply -m-2 flex flex-wrap md:justify-end;
    &__wrapper {
      @apply flex w-full justify-center p-2;
      button {
        @apply btn btn-primary;
      }
    }
  }
}
.reset-success {
  @apply flex flex-col justify-center gap-4 text-gray-600;
}
</style>
