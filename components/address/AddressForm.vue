<template>
  <form class="w-full" @submit="save">
    <div class="md:w-1/2 inline-block form-control w-full md:max-w-xs">
      <label class="label">
        <span class="label-text">{{ $t("address.name") }}</span>
      </label>
      <input
        v-model="value.name"
        :disabled="submitted"
        type="text"
        placeholder="Type here"
        class="input input-bordered w-full md:max-w-xs"
      />
    </div>
    <div class="md:w-1/2 inline-block p-2 form-control w-full md:max-w-xs">
      <label class="label">
        <span class="label-text">{{ $t("address.street") }}</span>
      </label>
      <input
        v-model="value.street"
        :disabled="submitted"
        type="text"
        placeholder="Type here"
        class="input input-bordered w-full md:max-w-xs"
      />
    </div>
    <div class="md:w-1/2 inline-block p-2 form-control w-full md:max-w-xs">
      <label class="label">
        <span class="label-text">{{ $t("address.zip") }}</span>
      </label>
      <input
        v-model="value.zip"
        :disabled="submitted"
        type="text"
        placeholder="Type here"
        class="input input-bordered w-full md:max-w-xs"
      />
    </div>
    <div class="md:w-1/2 inline-block p-2 form-control w-full md:max-w-xs">
      <label class="label">
        <span class="label-text">{{ $t("address.city") }}</span>
      </label>
      <input
        v-model="value.city"
        :disabled="submitted"
        type="text"
        placeholder="Type here"
        class="input input-bordered w-full md:max-w-xs"
      />
    </div>
    <div class="md:w-1/2 inline-block p-2 form-control w-full md:max-w-xs">
      <label class="label">
        <span class="label-text">{{ $t("address.country") }}</span>
      </label>
      <select class="select select-bordered w-full max-w-xs" v-model="value.country.id">
        <option disabled>{{ $t("address.country") }}</option>
        <option
          v-for="country of countries" :value="country.id"
          :selected="country.id === value?.country?.id"
        >
          {{ country.name }}
        </option>
      </select>
    </div>
    <div class="md:w-1/2 inline-block p-2 form-control w-full md:max-w-xs">
      <label class="label">
        <span class="label-text">{{ $t("address.phone") }}</span>
      </label>
      <input
        v-model="value.phone"
        :disabled="submitted"
        type="phone"
        class="input input-bordered w-full md:max-w-xs"
      />
    </div>
    <div class="pt-4 my-2 w-full flex items-center border-t">
      <div class="flex-grow">
        <slot name="actions" :address="value"></slot>
      </div>
      <button
        type="submit"
        :disabled="submitted"
        class="btn btn-primary"
      >
        <icon icon='mdi:check' class="w-5 h-5 mr-2" />
        {{ $t("actions.validate") }}
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
  emits: ["saved"],
  components: {
    'icon': Icon,
  },
  props: {
    address: {
      type: Object as PropType<Address> | null,
      required: false,
      default: null,
    },
  },
  data() {
    const countries = useSettings()?.countries || []
    return {
      value: new Address({}),
      submitted: false,
      countries,
    }
  },
  watch: {
    address: {
      handler: function (value) {
        console.log('address', value)
        if (value) {
          this.value = value;
        }
      },
      immediate: true,
    },
  },
  methods: {
    save(e:Event) {
      e.preventDefault()
      this.submitted = true
      const services = useShopinvaderServices()
      if(services?.addresses) {
        const addressService = services?.addresses
        if (this.value.id) {
          addressService.update(this.value)
        } else {
          addressService.create(this.value)
        }
      }
      this.submitted = false
      this.$emit("saved", this.value);
    },
  },
  computed: {
    hasValidCountry():boolean {
      return this.countries?.some((i:Country) => i.id == this.value?.country?.id )
    },
  },
});
</script>
