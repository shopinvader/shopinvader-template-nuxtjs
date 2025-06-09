<template class="logo-container">
  <nuxt-img
    v-if="logoUrl"
    :src="logoUrl"
    alt="Logo"
    :width="width"
    :height="height"
    :placeholder="15"
  />
  <div v-else>
    <div class="flex justify-center flex-col">
      <div class="font-heading text-3xl justify-center uppercase">
        LOGO
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  width: {
    type: Number,
    default: 100
  },
  height: {
    type: Number,
    default: 50
  }
})

const config = useAppConfig()
const logoUrl = config.theme.logo

</script>
<style>
@reference "@/assets/css/main.css";

.logo-container {
  img {
    max-width: 300px;
  }
}
</style>
