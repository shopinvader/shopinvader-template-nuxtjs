<template>
  <div v-if="auth?.type == 'credentials'">
    <slot name="head">
      <div v-if="!success" class="reset-heading">
        <h2 class="reset-heading__title">
          {{ t('account.reset.set_new_pswd_title') }}
        </h2>
        <p class="reset-heading__description">
          {{ t('account.reset.set_new_pswd_description') }}
        </p>
      </div>
    </slot>
    <div v-if="success" class="reset-success">
      <div class="reset-success__message">
        <icon name="check" class="text-success" />
        {{ t('account.reset.set_new_pswd_success') }}
      </div>
      <nuxt-link :to="localePath('/account/login')" class="reset-success__link">
        {{ t('account.reset.set_new_pswd_success_link') }}
        <icon name="right" />
      </nuxt-link>
    </div>
    <form v-else @submit.prevent="onSubmit" class="reset-form">
      <input-password
        v-model="password"
        :disabled="loading"
        @valid="(e:boolean) => (error.password = e)"
      >
        <template #label>
          {{ t('account.reset.new_password') }}
        </template>
      </input-password>
      <input-password
        v-model="repeatPassword"
        label="account.reset.new_password"
        :disabled="loading"
        @valid="(e:boolean) => (error.repeatPassword = e)"
      >
        <template #label>
          {{ t('account.reset.repeat_new_password') }}
        </template>
        <template #error>
          <template v-if="repeatPassword && password !== repeatPassword">
            {{ t('error.reset.pasword_missmatch') }}
          </template>
        </template>
      </input-password>
      <div class="reset-form__error">
        <slot v-if="error.auth" name="error">
          {{ error.auth }}
        </slot>
      </div>
      <div class="reset-form__submit">
        <slot name="submit" :error="error" :loading="loading">
          <button type="submit" class="submit__btn" :disabled="loading">
            <span v-if="loading" class="loading loading-spinner"></span>
            <icon v-else name="check" />
            {{ t('actions.validate') }}
          </button>
        </slot>
      </div>
    </form>
  </div>
</template>
<script lang="ts" setup>
import type { AuthCredentialService } from '#services'
const emits = defineEmits(['success', 'error'])
const loading = ref(false)
const success = ref(false)
const password = ref('')
const repeatPassword = ref('')
const error = reactive({
  auth: null as string | null,
  password: false,
  repeatPassword: false
})

const { t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()
const auth = useShopinvaderService('auth') as unknown as AuthCredentialService

const hasError = computed(
  () =>
    error.password ||
    error.repeatPassword ||
    !password.value ||
    !repeatPassword.value ||
    password.value !== repeatPassword.value
)
const onSubmit = async () => {
  loading.value = true
  const token = route.query.token as string
  try {
    //if (token && !hasError.value) {
    await auth?.setPassword(token, password.value)
    success.value = true
    emits('success')
    //}
  } catch (e: any) {
    console.error(e)
    const msg = erpApiGetErrorMessagesAsStr(e.data)
    error.auth = msg || t('error.generic')
    emits('error', error.auth)
  } finally {
    loading.value = false
  }
}
</script>
<style>
@reference "@/assets/css/main.css";

.reset-heading {
  @apply mb-10 text-center;
  &__title {
    @apply mb-4 text-2xl font-black tracking-tight text-black md:text-4xl;
  }
  &__description {
    @apply text-gray-500;
  }
}
.reset-form {
  @apply -m-3 mx-auto flex max-w-sm flex-wrap;
  &__submit {
    @apply flex w-full justify-center p-3;
    .submit__btn {
      @apply btn btn-primary;
    }
    // @apply flex w-full items-center justify-center p-3;
    // .reset-btn {
    //   @apply -m-2 flex flex-wrap md:justify-end;
    //   &__wrapper {
    //     @apply w-full p-2;
    //     button {
    //       @apply btn btn-primary;
    //     }
    //   }
    // }
  }
  &__error {
    @apply pl-4 text-sm italic text-red-500;
  }

  .footer-error {
    @apply rounded-3xl border border-error p-4 text-center text-gray-600;
  }
}
.reset-success {
  @apply flex flex-col items-center justify-center gap-4;
  &__message {
    @apply flex items-center gap-2 text-lg;
  }
  &__link {
    @apply btn btn-primary;
  }
  &__error {
    @apply alert alert-error;
  }
}
</style>
