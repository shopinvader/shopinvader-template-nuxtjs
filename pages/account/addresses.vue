<template>
  <div>
    {{ addresses }}
  </div>
</template>
<script lang="ts">

export default defineNuxtComponent({
  async setup() {
    const services = useShopinvaderServices()
    const addresses = await services?.addresses.getAll() 
    console.log("services", services)
    return {
      addresses
    }
  }
})
</script>