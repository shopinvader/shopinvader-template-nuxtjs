<template>
  <label class="input-password">
    <div class="input-password__label">
      <span class="label-text">
        <slot name="label"></slot>
      </span>
      <span class="label-text-alt">
        <slot name="label-alt"></slot>
      </span>
    </div>
    <div class="input-password__input" :class="{ 'input-password__input--error': error }">
      <input
        v-model="model"
        :id="id"
        :readonly="readonly"
        :disabled="disabled"
        :type="fieldView ? 'text' : 'password'"
        :required="required"
        :placeholder="fieldView ? '' : placeholder"
        :minlength="minlength"
        autocomplete="new-password"
        @blur="checkValidity"
        @focus="checkValidity"
        @input="(e) => onInput"
        @keyup="(e) => emit('input', e)"
        @keydown="(e) => emit('input', e)"
      />
      <button type="button" @click="fieldView = !fieldView" class="input__btn">
        <icon class="view-icon" :name="fieldView ? 'view' : 'hide'" />
      </button>
    </div>
    <div class="input-password__footer">
      <span class="footer__error">
        <slot name="error" :error="error">
          <template v-if="error">{{ t('error.login.password') }}</template>
        </slot>
      </span>
      <span class="label-text-alt">
        <slot name="label-bottom"></slot>
      </span>
    </div>
  </label>
</template>
<script lang="ts" setup>
const emit = defineEmits(['valid', 'input'])
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  id: {
    type: String,
    required: false,
    default: ''
  },
  readonly: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: ''
  },
  pattern: {
    type: String,
    default: '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@#$%^&+=!?])[A-Za-z\\d@#$%^&+=!?]{8,}$'
  },
  minlength: {
    type: Number,
    default: 8
  },
  required: {
    type: Boolean,
    default: true
  }
})
const { t } = useI18n()
const fieldView = ref(false)
const error = ref(false)
const model = defineModel({
  default: '',
  type: String
})
let timer: NodeJS.Timeout | null = null
const checkValidity = () => {
  error.value = false
  emit('input', model.value)
  const validity = model.value.match(new RegExp(props.pattern))

  if (!model.value) {
    return
  }
  error.value = !validity
  emit('valid', !error.value)
}
checkValidity()
watch(model, () => {
  error.value = false
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    checkValidity()
  }, 400)
})
</script>
<style>
@reference "@/assets/css/main.css";

.input-password {
  @apply form-control w-full;
  &__label {
    @apply label;
  }
  &__input {
    @apply input  flex items-center gap-2;
    input {
      @apply grow;
      &--error {
        @apply input-error;
      }
    }
    .input__btn {
      @apply btn btn-square btn-ghost;
    }
  }
  &__footer {
    @apply label;
    .footer__error {
      @apply label-text-alt text-xs text-error;
    }
  }
}
</style>
