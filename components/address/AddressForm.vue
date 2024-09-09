<template>
  <form class="w-full" @submit="save">
    <div class="flex w-full flex-wrap">
      <div v-for="title in titles" :key="title.id" class="form-control">
        <label class="label cursor-pointer">
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
    <div class="form-control inline-block w-full">
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
        class="input input-bordered w-full"
      />
    </div>
    <div class="form-control inline-block w-full">
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
        class="input input-bordered w-full"
      />
    </div>
    <div class="form-control inline-block w-full">
      <label class="label">
        <span class="label-text">{{ $t('account.address.street2') }}</span>
      </label>
      <input
        v-model="model.street2"
        :disabled="submitted"
        type="text"
        class="input input-bordered w-full"
      />
    </div>
    <div class="form-control inline-block w-full md:w-1/3 md:max-w-xs md:pr-2">
      <label class="required label">
        <span class="label-text">{{ $t('account.address.zip') }}</span>
      </label>
      <input
        v-model="model.zip"
        required
        :disabled="submitted"
        type="text"
        class="input input-bordered w-full md:max-w-xs"
      />
    </div>
    <div class="form-control inline-block w-full md:w-2/3">
      <label class="required label">
        <span class="label-text">{{ $t('account.address.city') }}</span>
      </label>
      <input
        v-model="model.city"
        required
        :disabled="submitted"
        type="text"
        class="input input-bordered w-full"
      />
    </div>
    <div
      v-if="countries.length > 0"
      class="form-control inline-block w-full md:w-1/2 md:max-w-xs md:pr-2"
    >
      <label class="required label">
        <span class="label-text">{{ $t('account.address.country') }}</span>
      </label>
      <select
        v-model="model.country"
        class="select select-bordered w-full max-w-xs"
        :disabled="submitted"
        required
      >
        <option disabled v-if="countries.length > 1">{{ $t('account.address.country') }}</option>
        <option v-for="country of countries" :key="country.id" :value="country">
          {{ country.name }}
        </option>
      </select>
    </div>
    <div class="form-control inline-block w-full md:w-1/2 md:max-w-xs">
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
        class="input input-bordered w-full md:max-w-xs"
      />
    </div>
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
import { Address, type Country } from '#models'

const props = defineProps({
  address: {
    type: Address,
    required: false,
    default: () => {
      return new Address({})
    }
  }
})
const emit = defineEmits(['saved'])
const settings = useShopinvaderService('settings')?.values
const countries = settings?.countries || []
const titles = settings?.titles || []
const model = ref(new Address({})) as Ref<Address>
const submitted = ref(false)

watch(
  () => props.address,
  (address) => {
    if (address) {
      model.value = address.clone() || new Address({})
    }
  },
  { immediate: true }
)

/**
 * emit the saved event
 * @param e
 */
const save = (e: Event) => {
  e.preventDefault()
  submitted.value = true
  emit('saved', model.value)
}
</script>
