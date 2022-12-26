<template>
  <div class="container mx-auto flex  items-start" v-if="addresses">
    <div
      v-for="address, i in addresses.data"
      :key="i"
      class="card md:w-1/3 bg-base-100 shadow-xl m-10 h-full"
    >
      <div class="card-body flex-col ">
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
          <button @click="selectItem(i)" class="btn btn-primary ">
            {{ i === activeItem && toggle ? 'X' : $t('actions.modify') }}
            </button>
        </div>
      </div>
      <div v-if="i === activeItem && toggle" class="p-5">
        <form>
          <div class="form-control w-full max-w-xs">
            <label class="label">
              <span class="label-text">{{$t('address.name')}}</span>
            </label>
            <input
              v-model="newAddress.name"
              type="text"
              placeholder="Type here"
              class="input input-bordered w-full max-w-xs"
            > 
          </div>
          <div class="form-control w-full max-w-xs">
            <label class="label">
              <span class="label-text">{{$t('address.street')}}</span>
            </label>
            <input
              v-model="newAddress.street"
              type="text"
              placeholder="Type here"
              class="input input-bordered w-full max-w-xs"
            > 
          </div>
          <div class="form-control w-full max-w-xs">
            <label class="label">
              <span class="label-text">{{$t('address.zip')}}</span>
            </label>
            <input
              v-model="newAddress.zip"
              type="text"
              placeholder="Type here"
              class="input input-bordered w-full max-w-xs"
            > 
          </div>
          <div class="form-control w-full max-w-xs">
            <label class="label">
              <span class="label-text">{{$t('address.phone')}}</span>
            </label>
            <input
              v-model="newAddress.phone"
              type="text"
              placeholder="Type here"
              class="input input-bordered w-full max-w-xs"
            > 
          </div>
          <div class="py-2">
            <button type="button" @click="updateAddress(address.id, name)" class="btn btn-primary">{{$t('actions.update')}}</button>
          </div>
        </form>
      </div>
    </div> 
  </div>
</template>
<script lang="ts">
import { ref } from 'vue'
export default defineNuxtComponent({
  
  async setup() { 
  
    const services = useShopinvaderServices();
    const addresses = await services?.addresses.getAll();

    const newAddress = ref({
      name: null,
      street: null,
      zip: null,
      phone: null
     })

     
    const activeItem = ref(null)
    const toggle = ref(false)


  function selectItem(i) {
    activeItem.value = i
    toggle.value = !toggle.value
  }

    function updateAddress(id: number, {data}: any) {
        return services?.addresses.update(id, newAddress.value
        ).then( async () => {
          addresses.value = await services?.addresses.getAll();
        }).then (() => {
            newAddress.value = {
              name: null,
              street: null,
              zip: null,
              phone: null
            }
        })  
    }

    

    return {
      addresses,
      updateAddress,
      name,
      toggle,
      activeItem,
      selectItem,
      newAddress
    }
  },
});
</script>
