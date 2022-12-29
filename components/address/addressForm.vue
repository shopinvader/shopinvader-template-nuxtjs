<template>
  <form class="w-full">
    <div class="md:w-1/2 inline-block form-control w-full md:max-w-xs p-2">
      <label class="label">
        <span class="label-text">{{ $t("address.name") }}</span>
      </label>
      <input
        v-model="newAddress.name"
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
        v-model="newAddress.street"
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
        v-model="newAddress.zip"
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
        v-model="newAddress.city"
        type="text"
        placeholder="Type here"
        class="input input-bordered w-full md:max-w-xs"
      />
    </div>
    <div class="md:w-1/2 inline-block p-2 form-control w-full md:max-w-xs">
      <label class="label">
        <span class="label-text">{{ $t("address.country") }}</span>
      </label>
      <input
        v-model="newAddress.country.name"
        type="text"
        placeholder="Type here"
        class="input input-bordered w-full md:max-w-xs"
      />
    </div>
    <div class="md:w-1/2 inline-block p-2 form-control w-full md:max-w-xs">
      <label class="label">
        <span class="label-text">{{ $t("address.phone") }}</span>
      </label>
      <input
        v-model="newAddress.phone"
        type="text"
        placeholder="Type here"
        class="input input-bordered w-full md:max-w-xs"
      />
    </div>
    <div class="py-2 w-full text-right">
      <button
        type="button"
        @click="sendForm()"
        class="btn btn-primary"
      >
        {{ $t("actions.validate") }}
      </button>
    </div>
  </form>
</template>
<script lang="ts">
import { ref } from "vue";
export default defineNuxtComponent({
  emits: ["sendForm"],
  props: {
    addressId: {
      type: Number,
      default: null,
    },
  },

  setup(props) {
    const newAddress = ref({
      name: null,
      street: null,
      zip: null,
      city: null,
      phone: null,
      country: { 
          id: 75, 
          name: null,
          code: "FR" 
        }
    });
    function sendForm() {
      this.$emit("sendForm", newAddress.value, props.addressId,);
      newAddress.value = {
        name: null,
        street: null,
        zip: null,
        city: null,
        phone: null,
        country: { 
          id: 75, 
          name: null,
          code: "FR"  
        }
      };
    }

    return {
      newAddress,
      sendForm,
    };
  },
});
</script>
