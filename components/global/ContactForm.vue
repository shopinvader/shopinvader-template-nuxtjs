<template>
  <section class="component-section">
    <div class="component-section__container">
      <div v-if="!done" class="outer-wrapper">
        <slot name="head">
          <div class="outer-wrapper__text">
            <span class="section-title">{{ $t('contact.title') }}</span>
            <h2 class="section-message">{{ $t('contact.message') }}</h2>
          </div>
        </slot>
        <div>
          <form v-if="lead" @submit="save">
            <slot name="subject" :subjects="subjects" :lead="lead" :loading="loading">
              <div class="form-fieldset--full">
                <div class="form-fieldset--full__field">
                  <label class="required label">
                    <span class="label-text">{{ $t('contact.subject') }}</span>
                  </label>
                  <template v-if="subjects.length > 0">
                    <select class="" v-model="lead.subject" required :disabled="loading">
                      <option v-for="subjet in subjects" :value="subjet.id" :key="subjet.id">
                        {{ subjet.name }}
                      </option>
                    </select>
                  </template>
                  <input
                    v-else
                    type="text"
                    class="form-fieldset__input"
                    :placeholder="$t('contact.subject')"
                    v-model="lead.subject"
                    :disabled="loading"
                    required
                  />
                </div>
              </div>
            </slot>
            <slot name="name" :loading="loading" :lead="lead">
              <div class="form-fieldset">
                <div class="form-fieldset__field">
                  <label class="required label">
                    <span class="label-text">{{ $t('account.address.name') }}</span>
                  </label>
                  <input
                    type="text"
                    class="form-fieldset__input"
                    :placeholder="$t('account.address.name')"
                    v-model="lead.name"
                    :disabled="loading"
                    required
                  />
                </div>
                <div class="form-fieldset__field">
                  <label class="label">
                    <span class="label-text">{{ $t('account.address.company') }}</span>
                  </label>
                  <input
                    type="text"
                    class="form-fieldset__input"
                    :placeholder="$t('account.address.company')"
                    v-model="lead.company"
                    :disabled="loading"
                  />
                </div>
              </div>
            </slot>
            <slot name="contact" :loading="loading" :lead="lead">
              <div class="form-fieldset">
                <div class="form-fieldset__field">
                  <label class="required label">
                    <span class="label-text">{{ $t('account.address.email') }}</span>
                  </label>
                  <input
                    type="email"
                    class="form-fieldset__input"
                    placeholder="name@example.com"
                    v-model="lead.email"
                    :disabled="loading"
                    required
                  />
                </div>

                <div class="form-fieldset__field">
                  <label class="required label">
                    <span class="label-text">{{ $t('account.address.phone') }}</span>
                  </label>
                  <input
                    type="text"
                    class="form-fieldset__input"
                    v-model="lead.phone"
                    :disabled="loading"
                    :placeholder="$t('account.address.phone')"
                    required
                  />
                </div>
              </div>
            </slot>
            <slot name="street" :loading="loading" :lead="lead">
              <div class="form-fieldset--full">
                <div class="form-fieldset--full__field">
                  <label class="required label">
                    <span class="label-text">{{ $t('account.address.street') }}</span>
                  </label>
                  <input
                    type="text"
                    class="form-fieldset__input"
                    v-model="lead.street"
                    :placeholder="$t('account.address.street')"
                    :disabled="loading"
                    required
                  />
                </div>
              </div>
            </slot>
            <slot name="street2" :loading="loading" :lead="lead">
              <div class="form-fieldset--full">
                <div class="form-fieldset--full__field">
                  <label class="label">
                    <span class="label-text">{{ $t('account.address.street2') }}</span>
                  </label>
                  <input
                    type="text"
                    class="form-fieldset__input"
                    v-model="lead.street2"
                    :placeholder="$t('account.address.street2')"
                    :disabled="loading"
                  />
                </div>
              </div>
            </slot>
            <slot name="city" :loading="loading" :lead="lead">
              <div class="form-fieldset">
                <div class="form-fieldset__field">
                  <label class="required label">
                    <span class="label-text">{{ $t('account.address.zip') }}</span>
                  </label>
                  <input
                    type="text"
                    class="form-fieldset__input"
                    v-model="lead.zip"
                    :placeholder="$t('account.address.zip')"
                    :disabled="loading"
                    required
                  />
                </div>
                <div class="form-fieldset__field required">
                  <label class="label">
                    <span class="label-text">{{ $t('account.address.city') }}</span>
                  </label>
                  <input
                    type="text"
                    class="form-fieldset__input"
                    v-model="lead.city"
                    :placeholder="$t('account.address.city')"
                    :disabled="loading"
                    required
                  />
                </div>
              </div>
            </slot>
            <slot name="country" :loading="loading" :lead="lead" :countries="countries">
              <div v-if="countries.length > 0" class="form-fieldset--full">
                <div class="form-fieldset--full__field">
                  <label class="required label">
                    <span class="label-text">{{ $t('account.address.country') }}</span>
                  </label>
                  <select class="" v-model="lead.country" required :disabled="loading">
                    <option v-for="country in countries" :value="country">
                      {{ country.name }}
                    </option>
                  </select>
                </div>
              </div>
            </slot>
            <slot name="message" :loading="loading" :lead="lead" :countries="countries">
              <div class="form-fieldset">
                <div class="form-fieldset__messagearea">
                  <label class="required label">
                    <span class="label-text">{{ $t('contact.description') }}</span>
                  </label>
                  <textarea
                    class="textarea"
                    v-model="lead.description"
                    :placeholder="$t('contact.description')"
                    :disabled="loading"
                    required
                  >
                  </textarea>
                </div>
              </div>
            </slot>
            <slot name="files" :loading="loading" :lead="lead">
              <label class="form-control w-full">
                <div class="label">
                  <span class="label-text">
                    {{ $t('contact.attachment') }}
                  </span>
                </div>
                <div class="w-full pb-1">
                  <div class="join w-full">
                    <input
                      type="file"
                      @change="(e) => addFile(e)"
                      ref="inputFile"
                      class="file-input file-input-bordered w-full"
                      :class="fileError ? 'file-input-error' : 'file-input-primary'"
                      :disabled="loading"
                      autocomplete="off"
                    />
                    <button type="button" class="btn btn-link" @click="clearFile">
                      <icon name="close" />
                    </button>
                  </div>
                  <div class="label">
                    <span v-if="fileError" class="label-text-alt text-error">
                      {{ fileError }}
                    </span>
                  </div>
                </div>
              </label>
            </slot>
            <slot name="error">
              <div v-if="error" class="alert my-5">
                <icon name="error" class="text-error" />
                <span>{{ $t('error.generic') }}</span>
              </div>
            </slot>
            <slot name="action">
              <div class="form-fieldset-last">
                <label class="pr-4">
                  <input type="checkbox" name="terms" value="1" required />
                  <span>{{ $t('contact.data_protection') }}</span>
                  <nuxt-link :to="privacyPolicylink" target="_blank">
                    <span class="pointer">{{ $t('contact.data_policy') }}</span>
                  </nuxt-link>
                </label>
                <button class="form-fieldset-last__submit" type="submit" :disabled="loading">
                  {{ $t('contact.send') }}
                </button>
              </div>
            </slot>
          </form>
        </div>
      </div>
      <div v-else>
        <div class="message__container">
          <div class="icon-wrapper">
            <icon name="ic:outline-email" class="icon-wrapper__icon" />
          </div>
          <div class="text-content">
            {{ $t('contact.form_sent.thankyou_title') }}
            <div>
              {{ $t('contact.form_sent.thankyou_description') }}
            </div>
          </div>
          <nuxt-link :to="localePath({ path: '/' })" class="btn btn-primary btn-outline">
            {{ $t('btn.back') }}
          </nuxt-link>
        </div>
      </div>
    </div>
  </section>
</template>
<script lang="ts" setup>
import { Country, Lead, Title } from '#models'
const props = defineProps({
  dataPolicyPage: {
    type: String,
    required: false
  },
  subjects: {
    type: Array as PropType<Title[]>,
    required: false,
    default: () => null
  }
})
const emit = defineEmits(['submit'])
const localePath = useLocalePath()
const inputFile = ref<HTMLInputElement | null>(null)
const files = ref<FileList | null>(null)
const privacyPolicylink = props.dataPolicyPage || localePath({ path: '/privacy-policy' })
const fileError = ref<string | null>(null)
const countries = ref<Country[]>([])
const subjects = ref<Title[]>([])
const loading = ref(false)
const error = ref(null)
const done = ref(false)
const lead = ref(new Lead({}))
const { t } = useI18n()

onMounted(() => {
  const settingsService = useShopinvaderService('settings')
  countries.value = settingsService?.values?.countries || []
  subjects.value = props?.subjects || settingsService?.values?.leadSubjects || []
  lead.value.country = countries.value[0]
})

const addFile = (e: Event) => {
  files.value = (e.target as HTMLInputElement).files
}

const clearFile = () => {
  files.value = null
  if (inputFile.value) {
    inputFile.value.value = ''
  }
}
const save = async (e: Event) => {
  e.preventDefault()
  const leadsService = useShopinvaderService('leads')
  const notifications = useNotification()
  try {
    error.value = null
    loading.value = true
    await leadsService?.create(lead.value, files.value)
    done.value = true
  } catch (e) {
    console.error(e)
    error.value = e
    notifications.addError(t('contact.error'))
  } finally {
    loading.value = false
  }
}
</script>
<style lang="scss">
.component-section {
  @apply py-20;
  &__container {
    @apply container mx-auto  flex w-full justify-center px-4;
    .message {
      &__container {
        @apply w-full max-w-2xl rounded-3xl bg-base-100 px-8 py-20 text-center lg:px-20;
        .icon-wrapper {
          @apply pb-6 text-center;

          &__icon {
            @apply inline rounded-full bg-success p-3 text-6xl text-white;
          }
        }
        .text-content {
          @apply mb-8 text-lg font-bold;
        }
      }
    }
    .outer-wrapper {
      @apply mx-auto max-w-3xl text-center;
      &__text {
        @apply mx-auto mb-8 max-w-md;
        .section-title {
          @apply text-sm text-gray-700;
        }
        .section-message {
          @apply mt-2 font-heading text-4xl font-bold;
        }
      }
      .form-fieldset--full {
        &__field {
          @apply form-control flex w-full justify-center;
          label {
            @apply label justify-start;
          }
          select {
            @apply select mr-2 rounded bg-gray-100 outline-none;
          }
        }
      }
      .form-fieldset {
        @apply form-control mb-4 flex w-full flex-col justify-center md:flex-row;
        .form-fieldset__field {
          @apply flex w-full flex-col md:w-1/2;
        }
        textarea {
          @apply h-24 w-full resize-none rounded bg-gray-50 p-4 text-xs font-semibold leading-none outline-none;
        }
        &__input {
          @apply input mr-2 rounded bg-gray-100 p-4 text-xs font-semibold leading-none outline-none;
        }
        &__select {
          @apply select mr-2 w-full rounded bg-gray-100 p-4 text-xs font-semibold leading-none text-gray-400 outline-none md:w-1/2;
        }
        &__messagearea {
          @apply w-full;

          label {
            @apply justify-start;
          }
        }
      }
      .form-fieldset-last {
        @apply flex items-center justify-between;
        label {
          input {
            @apply mr-1;
          }
          span {
            @apply text-sm font-semibold text-primary;
          }
        }
        &__submit {
          @apply rounded bg-primary px-8 py-4 text-sm font-semibold leading-none text-white hover:bg-blue-900;
        }
      }
      .form-fieldset,
      .form-fieldset--full {
        .required {
          .label-text {
            &:after {
              @apply inline pr-1 text-error;
              content: '*';
            }
          }
        }
      }
    }
  }
}
</style>
