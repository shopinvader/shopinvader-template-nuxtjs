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
      <label class="required label">
        <span class="label-text">
          {{ $t('account.address.name') }}
        </span>
      </label>
      <input
        v-model="value.name"
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
        v-model="value.street"
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
        v-model="value.street2"
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
        v-model="value.zip"
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
        v-model="value.city"
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
        v-model="value.country"
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
        v-model="value.phone"
        :disabled="submitted"
        type="phone"
        class="input input-bordered w-full md:max-w-xs"
      />
    </div>
    <slot name="footer" :address="value">
      <div class="my-2 flex w-full items-center border-t pt-4">
        <div class="flex-grow">
          <slot name="actions" :address="value"></slot>
        </div>
        <button type="submit" :disabled="submitted" class="btn btn-primary">
          <icon name="check" class="mr-2 h-5 w-5" />
          {{ $t('actions.validate') }}
        </button>
      </div>
    </slot>
  </form>
</template>
<script lang="ts">
import type { Country } from '#models'
import { type PropType } from 'vue'
import { Address } from '~/models'

export default defineNuxtComponent({
  emits: ['saved'],
  props: {
    address: {
      type: Object as PropType<Address> | null,
      required: false,
      default: () => {
        return new Address({})
      }
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
      titles,
      countryId: null
    }
  },
  watch: {
    countryId: {
      handler: function (value) {
        if (value) {
          this.address.country = this.countries.find((i: Country) => {
            return i.id == value
          })
        }
      },
      immediate: true
    },
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
      return this.countries?.some((i: Country) => i.id == this.value?.country?.id)
    }
  }
})
</script>
