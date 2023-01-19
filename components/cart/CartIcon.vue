<template>
  <nuxt-link :to="localePath({ path: '/cart' })" class="relative px-2">
    <div>
      <Icon icon="clarity:shopping-bag-line" class="text-3xl lg:text-5xl" />
    </div>
    <div v-if="hasCart" class="absolute-right-2 badge-secondary badge -top-1">
      {{ linesCount }}
    </div>
  </nuxt-link>
</template>
<script lang="ts">
export default {
  name: 'CartIcon',
  components: {},
  async setup() {
    return {
      hasCart: computed((): boolean => {
        let linesCount: number = useCart()?.linesCount || 0
        return linesCount > 0
      }),
      linesCount: computed((): string => {
        let linesCount: boolean | string | number =
          useCart()?.linesCount || false
        if (linesCount > 100) {
          return '99+'
        } else {
          return linesCount + ''
        }
      })
    }
  }
}
</script>
