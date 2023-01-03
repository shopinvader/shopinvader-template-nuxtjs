<template>
  <div class="container mx-auto min-h-screen">
    <div class="flex items-center py-3">
      <div class="flex items-center flex-grow">
        <icon icon="ph:address-book" class="text-5xl pr-2"></icon>
        <h1 class=" text-3xl">
          {{ $t('account.address.title')}}
        </h1>
      </div>
      <div class="p-4 text-right">
        <button type="button" @click="toggleForm = !toggleForm" class="btn btn-secondary">
          + {{ $t("actions.create") }}
        </button>
      </div>
    </div>
    <div v-if="toggleForm" class="p-5 flex justify-center">
      <div class="card md:w-1/2 w-full bg-base-100 shadow-xl md:m-10 h-full">
        <div class="card-body">
          <address-form @sendForm="createAddress"></address-form>
        </div>
      </div>
    </div>
    <div v-else class="py-8">
      <client-only>
        <address-list></address-list>
      </client-only>
    </div>
  </div>
</template>
<script lang="ts">
import { ref } from "vue";
import AddressForm from "~~/components/address/AddressForm.vue";
import AddressList from "~~/components/address/AddressList.vue";


export default defineNuxtComponent({
  layout: "account",
  components: {
    'address-list': AddressList,
    'address-form': AddressForm,
  },
  data() {
    return {
      toggleForm: false,

    };
  },
  async setup() {
    const services = useShopinvaderServices()
    function createAddress(data: any) {

    }
    return {
      createAddress,
    }
    /*
    const user = computed(() => useCurrentUser())
    const services = useShopinvaderServices()
    const activeItem = ref(null)
    const toggle = ref(false)
    const toggleForm = ref(false)
    let addresses = ref(null as AddressResult | null)
    const settings = useSettings()
    watch(user, async () => {
      addresses.value = await services?.addresses.getAll() as AddressResult
    })

    function selectItem(i) {
      activeItem.value = i;
      toggle.value = !toggle.value;
    }

    function updateAddress(data: any, id: number) {
      return services?.addresses
        .update(data, id)
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
      toggleForm,
      settings
    };
    */
  },
});
</script>
