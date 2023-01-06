<template>
  <form class="w-full" @submit="save">
    <div class="w-full flex flex-wrap">
      <div v-for="title in titles" :key="title.id" class="form-control">
        <label class="label cursor-pointer">
          <input type="radio" name="title" class="radio" :value="title" v-model="value.title" :disabled="submitted" />
          <span class="label-text pl-2">{{ title.name }}</span>
        </label>
      </div>
    </div>
    <div class="w-full inline-block form-control">
      <label class="label">
        <span class="label-text">{{ $t("address.name") }}</span>
      </label>
      <input v-model="value.name" :disabled="submitted" type="text" required class="input input-bordered w-full" />
    </div>
    <div class="w-full inline-block form-control">
      <label class="label">
        <span class="label-text">{{ $t("address.street") }}</span>
      </label>
      <input v-model="value.street" required bled="submitted" type="text" class="input input-bordered w-full" />
    </div>
    <div class="w-full inline-block form-control">
      <label class="label">
        <span class="label-text">{{ $t("address.street2") }}</span>
      </label>
      <input v-model="value.street2" :disabled="submitted" type="text" class="input input-bordered w-full" />
    </div>
    <div class="md:w-1/3 inline-block md:pr-2 form-control w-full md:max-w-xs">
      <label class="label">
        <span class="label-text">{{ $t("address.zip") }}</span>
      </label>
      <input v-model="value.zip" required :disabled="submitted" type="text"
        class="input input-bordered w-full md:max-w-xs" />
    </div>
    <div class="md:w-2/3 inline-block form-control w-full">
      <label class="label">
        <span class="label-text">{{ $t("address.city") }}</span>
      </label>
      <input v-model="value.city" required :disabled="submitted" type="text" class="input input-bordered w-full" />
    </div>
    <div class="md:w-1/2 inline-block md:pr-2 form-control w-full md:max-w-xs">
      <label class="label">
        <span class="label-text">{{ $t("address.country") }}</span>
      </label>
      <select class="select select-bordered w-full max-w-xs" :disabled="submitted" required v-model="value.country.id">
        <option disabled>{{ $t("address.country") }}</option>
        <option v-for="country of countries" :value="country.id" :selected="country.id === value?.country?.id">
          {{ country.name }}
        </option>
      </select>
    </div>
    <div class="md:w-1/2 inline-block  form-control w-full md:max-w-xs">
      <label class="label">
        <span class="label-text">{{ $t("address.phone") }}</span>
      </label>
      <input v-model="value.phone" :disabled="submitted" type="phone" class="input input-bordered w-full md:max-w-xs" />
    </div>
    <div class="pt-4 my-2 w-full flex items-center border-t">
      <div class="flex-grow">
        <slot name="actions" :address="value"></slot>
      </div>
      <button type="submit" :disabled="submitted" class="btn btn-primary">
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
    const titles = useSettings()?.titles || []
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
        console.log('address', value)
        if (value) {
          if (value?.country?.id == null) {
            value.country = this.countries?.[0] || null
          }
          if (value?.title?.id == null) {
            value.title = this.titles?.[0] || null
          }
          this.value = value;
        }
      },
      immediate: true,
    },
  },
  methods: {
    save(e: Event) {
      e.preventDefault()
      this.submitted = true
      this.$emit("saved", this.value);
    },
  },
  computed: {
    hasValidCountry(): boolean {
      return this.countries?.some((i: Country) => i.id == this.value?.country?.id)
    },
  },
});
</script>
