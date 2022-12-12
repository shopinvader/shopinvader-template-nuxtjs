<template>
  <nuxt-link :to="localePath({ path: '/cart' })" class="btn relative">
    {{ $t('cart.title') }}
    <div
      v-if="linesCount"
      class="absolute badge badge-secondary -right-2 -top-2"
    >
      {{ linesCount }}
    </div>
  </nuxt-link>
</template>
<script lang="ts">
  export default {
    name: 'CartIcon',
    components: {
    },
    async setup(props) {
      return {
        linesCount: computed(():boolean | string => {
          let linesCount = useCart()?.linesCount || false
          if(linesCount > 100) {
            linesCount = '99+'
          }
          return linesCount
        })
      }
    }
  }
</script>