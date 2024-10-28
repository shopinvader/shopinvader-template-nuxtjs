<template>
  <label class="form-control w-full">
    <div class="label">
      <span class="label-text">
        <slot name="label"></slot>
      </span>
      <span class="label-text-alt">
        <slot name="label-alt"></slot>
      </span>
    </div>
    <div class="input input-bordered flex items-center gap-2">
      <input
        v-model="model"
        :id="id"
        :readonly="readonly"
        :disabled="disabled"
        :type="fieldView ? 'text' : 'password'"
        :required="required"
        :placeholder="fieldView ? '' : placeholder"
        class="grow"
        :minlength="minlength"
        :pattern="pattern"
        @blur="checkValidity"
        @focus="checkValidity"
        @input="(e) => onInput"
        @keyup="(e) => emit('input', e)"
        @keydown="(e) => emit('input', e)"
      />
      <button type="button" @click="fieldView = !fieldView" class="btn btn-square btn-ghost">
        <icon class="view-icon" :name="fieldView ? 'view' : 'hide'" />
      </button>
    </div>
    <div class="label">
      <span class="label-text-alt">
        <slot name="label-bottom-left" :error="error">
          {{ error }}
        </slot>
      </span>
      <span class="label-text-alt">
        <slot name="label-bottom-right"></slot>
      </span>
    </div>
  </label>
</template>
<script lang="ts" setup>
const emit = defineEmits(['keyup', 'keydown', 'input', 'error'])
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
const fieldView = ref(false)
const error = ref(false)
const model = defineModel({
  default: '',
  type: String
})
const checkValidity = (e: KeyboardEvent) => {
  const validity = model.value.match(new RegExp(props.pattern))
  error.value = !validity
  if (error.value) {
    emit('error', e)
  } else {
    emit('input', e)
  }
}
const onInput = (e: KeyboardEvent) => {
  setTimeout(() => {
    checkValidity(e)
  }, 3000)
}
</script>
