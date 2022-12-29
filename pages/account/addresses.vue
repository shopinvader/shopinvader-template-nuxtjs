<template>
  <div class="container mx-auto">
    <div class="p-4 w-full text-right">
      <button
        type="button"
        @click="toggleForm=!toggleForm"
        class="btn btn-secondary"
      >
        + {{ $t("actions.create") }}
      </button>
    </div>
    <div v-if="toggleForm" class="p-5 flex justify-center">
      <div class="card md:w-1/2 w-full bg-base-100 shadow-xl md:m-10 h-full">
      <div class="card-body">
        <address-form  @sendForm="createAddress"></address-form>
      </div>
      </div>
    </div>
  </div>
  <div class="container mx-auto md:flex md:items-start md:m-8 m-5" v-if="addresses">
    <div
      v-for="(address, i) in addresses.data"
      :key="i"
      class="card w-full md:w-1/2  bg-base-100 shadow-xl md:m-10 my-5"
    >
      <div class="card-body flex-col">
        <Icon icon="ph:address-book" class="text-5xl text-blue-500" />
        <h2 class="card-title">
          {{ address.displayName }}
          <div
            v-if="address.addressType == 'profile'"
            class="badge badge-secondary"
          >
            Adresse de contact
          </div>
          <div
            v-if="address.addressType == 'delivery'"
            class="badge badge-secondary"
          >
            Adresse de livraison
          </div>
        </h2>
        <p>{{ address.email }}</p>
        <p>{{ address.street }}</p>
        <p>{{ address.zip }} {{ address.city }}</p>
        <p>{{ address.phone }}</p>
        <div class="card-actions justify-end">
          <button @click="selectItem(i)" class="btn btn-primary">
            {{ i === activeItem && toggle ? "X" : $t("actions.modify") }}
          </button>
        </div>
      </div>
      <div v-if="i === activeItem && toggle" class="p-5 border-b">
        <address-form :addressId="address.id" @sendForm="updateAddress"></address-form>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { ref } from "vue";
import addressForm from "~~/components/address/addressForm.vue";
export default defineNuxtComponent({
  components: { addressForm },
  async setup() {
    const services = useShopinvaderServices();
    const addresses = await services?.addresses.getAll();


    const activeItem = ref(null);
    const toggle = ref(false);

    const toggleForm = ref(false);

    function selectItem(i) {
      activeItem.value = i;
      toggle.value = !toggle.value;
    }

    function updateAddress(data: any, id: number ) {
      return services?.addresses
        .update(data, id )
        .then(async () => {
          addresses.value = await services?.addresses.getAll();
        })
    }

    function createAddress(data: any) {
      return services?.addresses
        .create(data)
        .then(async () => {
          addresses.value = await services?.addresses.getAll();
        })
    }

    return {
      addresses,
      updateAddress,
      createAddress,
      toggle,
      activeItem,
      selectItem,
      toggleForm
    };
  },
});
</script>
