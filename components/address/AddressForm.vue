<template>
  <form class="address-form" @submit="save">
    <slot name="title" :address="model" :titles="titles" :submitted="submitted">
      <div class="address-form__title">
        <div v-for="title in titles" :key="title.id" class="title__control">
          <label class="label">
            <input
              v-model="model.title"
              type="radio"
              name="title"
              class="radio"
              :value="title"
              :disabled="submitted"
            />
            <span class="label-text pl-2">{{ title.name }}</span>
          </label>
        </div>
      </div>
    </slot>
    <slot name="name" :address="model" :submitted="submitted">
      <div class="address-form__name">
        <label class="required label">
          <span class="label-text">
            {{ $t('account.address.name') }}
          </span>
        </label>
        <input
          v-model="model.name"
          :disabled="submitted"
          type="text"
          required
          class="input w-full"
        />
      </div>
    </slot>
    <slot name="street" :address="model" :submitted="submitted">
      <div class="address-form__street">
        <label class="required label">
          <span class="label-text">
            {{ $t('account.address.street') }}
          </span>
        </label>
        <input
          v-model="model.street"
          required
          :disabled="submitted"
          type="text"
          class="input w-full"
        />
      </div>
    </slot>
    <slot name="street2" :address="model" :submitted="submitted">
      <div class="address-form__street2">
        <label class="label">
          <span class="label-text">{{ $t('account.address.street2') }}</span>
        </label>
        <input v-model="model.street2" :disabled="submitted" type="text" class="input w-full" />
      </div>
    </slot>
    <slot name="city" :address="model" :submitted="submitted">
      <div class="address-form__zip">
        <label class="required label">
          <span class="label-text">{{ $t('account.address.zip') }}</span>
        </label>
        <input
          v-model="model.zip"
          required
          :disabled="submitted"
          type="text"
          class="input w-full"
        />
      </div>
      <div class="address-form__city">
        <label class="required label">
          <span class="label-text">{{ $t('account.address.city') }}</span>
        </label>
        <input
          v-model="model.city"
          required
          :disabled="submitted"
          type="text"
          class="input w-full"
        />
      </div>
    </slot>
    <slot name="country" :address="model" :submitted="submitted" :countries="countries">
      <div v-if="countries.length > 0" class="address-form__country">
        <label class="required label">
          <span class="label-text">{{ $t('account.address.country') }}</span>
        </label>
        <select
          v-model="model.country"
          class="select w-full max-w-xs"
          :disabled="submitted"
          required
        >
          <option disabled v-if="countries.length > 1">{{ $t('account.address.country') }}</option>
          <option v-for="country of countries" :key="country.id" :value="country">
            {{ country.name }}
          </option>
        </select>
      </div>
    </slot>
    <slot name="phone" :address="model" :submitted="submitted">
      <div class="address-form__phone">
        <label class="label">
          <span class="label-text">
            <icon name="phone" />
            {{ $t('account.address.phone') }}
          </span>
        </label>
        <input
          v-model="model.phone"
          :disabled="submitted"
          type="phone"
          class="input w-full md:max-w-xs"
        />
      </div>
    </slot>
    <slot name="mobile" :address="model" :submitted="submitted">
      <div class="address-form__mobile">
        <label class="label">
          <span class="label-text">
            <icon name="mobile" />
            {{ $t('account.address.mobile') }}
          </span>
        </label>
        <input
          v-model="model.mobile"
          :disabled="submitted"
          type="mobile"
          class="input w-full md:max-w-xs"
        />
      </div>
    </slot>
    <slot name="container" :address="model" :submitted="submitted"></slot>
    <slot name="footer" :address="model">
      <div class="my-2 flex w-full items-center border-t pt-4">
        <div class="flex-grow">
          <slot name="actions" :address="model"></slot>
        </div>
        <button type="submit" :disabled="submitted" class="btn btn-primary">
          <icon name="check" class="mr-2 h-5 w-5" />
          {{ $t('actions.validate') }}
        </button>
      </div>
    </slot>
  </form>
</template>
<script lang="ts" setup>
import { Address } from '#models'

const props = defineProps({
  address: {
    type: Address,
    required: false,
    default: () => {
      return new Address({})
    }
  }
})
const emit = defineEmits(['submit'])
const settings = useShopinvaderService('settings')?.values
const countries = settings?.countries || []
const titles = settings?.titles || []
const model = ref(new Address({})) as Ref<Address>
const submitted = ref(false)

watch(
  () => props.address,
  (address) => {
    if (address) {
      model.value = address.clone<Address>() || new Address({})
    }
  },
  { immediate: true }
)

/**
 * emit the submit event
 * @param e
 */
const save = (e: Event) => {
  e.preventDefault()
  submitted.value = true
  emit('submit', model.value)
}
</script>
<style lang="scss">
.address-form {
  @apply w-full;
  .label {
    @apply cursor-pointer;
    &.required {
      .label-text {
        &:after {
          @apply inline pr-1 text-error;
          content: '*';
        }
      }
    }
  }
  .input {
    @apply input-bordered;
  }
  .select {
    @apply select-bordered;
  }
  .label {
    .label-text {
      @apply flex items-center gap-1;
      .icon {
        @apply h-4 w-4;
      }
    }
  }
  &__title {
    @apply flex w-full flex-wrap;
    .title {
      &__control {
        @apply form-control;
      }
    }
  }
  &__name {
    @apply form-control inline-block w-full;
  }
  &__street {
    @apply form-control inline-block w-full;
  }
  &__street2 {
    @apply form-control inline-block w-full;
  }
  &__zip {
    @apply form-control inline-block w-full md:w-1/3 md:max-w-xs md:pr-2;
  }
  &__city {
    @apply form-control inline-block w-full md:w-2/3;
  }
  &__country {
    @apply form-control inline-block w-full md:w-1/2 md:max-w-xs md:pr-2;
  }
  &__phone {
    @apply form-control inline-block w-full md:w-1/2 md:max-w-xs md:pr-2;
  }
  &__mobile {
    @apply form-control inline-block w-full md:w-1/2 md:max-w-xs;
  }
}
</style>
