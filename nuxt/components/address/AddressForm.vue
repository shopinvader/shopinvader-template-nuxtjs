<template>
  <form class="w-full" @submit="save">
    <div class="flex w-full flex-wrap">
      <div v-for="title in titles" :key="title.id" class="form-control">
        <label class="label cursor-pointer">
          <input
            v-model="value.title"
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
      <label class="label">
        <span class="label-text">{{ $t('account.address.name') }}</span>
      </label>
      <input
        v-model="value.name"
        :disabled="submitted"
        type="text"
        required
        class="input-bordered input w-full"
      />
    </div>
    <div class="form-control inline-block w-full">
      <label class="label">
        <span class="label-text">{{ $t('account.address.street') }}</span>
      </label>
      <input
        v-model="value.street"
        required
        bled="submitted"
        type="text"
        class="input-bordered input w-full"
      />
    </div>
    <div class="form-control inline-block w-full">
      <label class="label">
        <span class="label-text">{{ $t('account.address.street2') }}</span>
      </label>
      <input
        v-model="value.street2"
        :disabled="submitted"
        type="text"
        class="input-bordered input w-full"
      />
    </div>
    <div class="form-control inline-block w-full md:w-1/3 md:max-w-xs md:pr-2">
      <label class="label">
        <span class="label-text">{{ $t('account.address.zip') }}</span>
      </label>
      <input
        v-model="value.zip"
        required
        :disabled="submitted"
        type="text"
        class="input-bordered input w-full md:max-w-xs"
      />
    </div>
    <div class="form-control inline-block w-full md:w-2/3">
      <label class="label">
        <span class="label-text">{{ $t('account.address.city') }}</span>
      </label>
      <input
        v-model="value.city"
        required
        :disabled="submitted"
        type="text"
        class="input-bordered input w-full"
      />
    </div>
    <div class="form-control inline-block w-full md:w-1/2 md:max-w-xs md:pr-2">
      <label class="label">
        <span class="label-text">{{ $t('account.address.country') }}</span>
      </label>
      <select
        v-model="value.country.id"
        class="select-bordered select w-full max-w-xs"
        :disabled="submitted"
        required
      >
        <option disabled>{{ $t('account.address.country') }}</option>
        <option
          v-for="country of countries"
          :key="country.id"
          :value="country.id"
          :selected="country.id === value?.country?.id"
        >
          {{ country.name }}
        </option>
      </select>
    </div>
    <div class="form-control inline-block w-full md:w-1/2 md:max-w-xs">
      <label class="label">
        <span class="label-text">{{ $t('account.address.phone') }}</span>
      </label>
      <input
        v-model="value.phone"
        :disabled="submitted"
        type="phone"
        class="input-bordered input w-full md:max-w-xs"
      />
    </div>
    <div class="my-2 flex w-full items-center border-t pt-4">
      <div class="flex-grow">
        <slot name="actions" :address="value"></slot>
      </div>
      <button type="submit" :disabled="submitted" class="btn-primary btn">
        <icon icon="mdi:check" class="mr-2 h-5 w-5" />
        {{ $t('actions.validate') }}
      </button>
    </div>
  </form>
</template>
<script lang="ts">
import { PropType, ref } from 'vue'
import { Address } from '~/models'
import { Country } from '~~/models/Country'
import { Icon } from '@iconify/vue'

export default defineNuxtComponent({
  emits: ['saved'],
  components: {
    icon: Icon
  },
  props: {
    address: {
      type: Object as PropType<Address> | null,
      required: false,
      default: null
    }
  },
  data() {
    const settings = useShopinvaderService('settings')?.options
    const countries = settings?.countries || []
    const titles = settings?.titles || []
    return {
      value: new Address({}),
      submitted: false,
      countries,
      titles
    }
  },
  watch: {
    address: {
      handler: function (value) {
        if (value) {
          if (value?.country?.id == null) {
            value.country = this.countries?.[0] || null
          }
          if (value?.title?.id == null) {
            value.title = this.titles?.[0] || null
          }
          this.value = value
        }
      },
      immediate: true
    }
  },
  methods: {
    save(e: Event) {
      e.preventDefault()
      this.submitted = true
      this.$emit('saved', this.value)
    }
  },
  computed: {
    hasValidCountry(): boolean {
      return this.countries?.some(
        (i: Country) => i.id == this.value?.country?.id
      )
    }
  }
})
</script>
