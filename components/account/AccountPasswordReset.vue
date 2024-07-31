<template>
  <div v-if="auth?.type == 'credentials'">
    <template v-if="!successMessage">
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
              @keyup="checkValidity($event)"
              required
              placeholder="Enter email address"
            />
          </div>
          <div class="reset-form__error" v-if="error.login">
            {{ $t('error.login.email') }}
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
              <div class="footer-error" v-if="error.auth">
                {{ error.auth }}
              </div>
            </slot>
          </div>
        </div>
      </form>
    </template>
    <div v-else class="reset-success">
      <slot name="success">
        <h2 class="reset-success__title">
          {{ $t('account.reset.reset_pswd') }}
        </h2>
        {{ $t('account.reset.reset_success') }}
        <div>
          <nuxt-link :to="localePath('account')" class="btn btn-primary">
            <icon name="left" />
            {{ $t('btn.back') }}
          </nuxt-link>
        </div>
      </slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { AuthCredentialService } from '#services'
const login = ref('')
const successMessage = ref(false)
const error = reactive({
  auth: null,
  login: false
})
const localePath = useLocalePath()
const auth = useShopinvaderService('auth') as AuthCredentialService
const route = useRoute()

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
  if (login.value) {
    try {
      const resetPasswordSent = (await auth?.resetPassword(
        login.value
      )) as boolean
      if (resetPasswordSent) {
        successMessage.value = true
      }
      login.value = ''
    } catch (e) {
      console.error(e)
      error.auth = e?.message || $t('error.login.unable_to_login')
    }
  }
}

</script>
<style lang="scss">
.reset-heading {
  @apply mb-10 text-center;
  &__title {
    @apply mb-4 text-4xl tracking-tight text-black md:text-5xl;
  }
  &__description {
    @apply text-gray-500;
  }
}
.reset-form {
  @apply flex flex-wrap justify-center;
  &__row {
    @apply form-control w-full  max-w-md;
    label {
      @apply label;
    }
    input {
      @apply input input-bordered w-full   ;
    }
  }
  &__error {
    @apply pl-4 text-sm text-error;
  }

  .reset-btn {
    @apply -m-2 flex flex-wrap md:justify-end;
    &__wrapper {
      @apply flex justify-center w-full p-2;
      button {
        @apply btn btn-primary;
      }
    }
  }
  .footer-error {
    @apply rounded-3xl border border-error p-4 text-center text-gray-600;
  }
}
.reset-success {
  @apply flex flex-col justify-center gap-4 text-gray-600;
}
</style>
