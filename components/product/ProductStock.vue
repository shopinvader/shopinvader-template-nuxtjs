<template>
  <slot name="stock-status">
    <div class="stock-status">
      <div v-if="stock >= 4" class="stock-status__available">
        <icon icon="mdi:check" class="stock-icon " />
        <span class="stock-text">{{ $t('product.stock.available') }}</span> 
      </div>
      <div v-else-if="stock > 0 && stock < 4" class="stock-status__ending ">
        <icon icon="iconamoon:attention-circle-thin" class="stock-icon" />
        <span class="stock-text">{{stock }} {{ $t('product.stock.ending_soon') }}</span> 
      </div>
      <div v-else-if="stock <= 0" class=" stock-status__out-of-stock  ">
        <icon icon="entypo:cycle" class="stock-icon" />
        <span class="stock-text">{{ $t('product.stock.not_available') }}</span> 
      </div>  
    </div>
  </slot>
</template>
<script lang="ts">

export default {
  name: 'ProductStock',
  props: {
    stock: {
      type: Number,
      required: true,
      default: 0
    }
  }
}
</script>
<style lang="scss">
.stock-status {
  &__available{
    @apply  text-primary max-w-max bg-gray-200 text-sm px-4 py-1 transition-colors ease-in duration-200 hover:bg-green-100;
      .stock-icon {
        @apply text-success text-xl inline mr-1;
      }
      .stock-text {
        @apply text-neutral;
      }
  }
  &__ending {
    @apply text-primary max-w-max bg-gray-200 text-sm px-4 py-1 transition-colors ease-in duration-200 hover:bg-green-100;

    .stock-icon {
        @apply text-error text-xl inline mr-1;
      }
      .stock-text {
        @apply text-error;
      }
  }
  &__out-of-stock{
    @apply text-primary max-w-max bg-gray-200 text-sm px-4 py-1 transition-colors ease-in duration-200 hover:bg-orange-100;
    .stock-icon {
        @apply text-error text-xl inline mr-1;
      }
      .stock-text {
        @apply text-error;
      }
  }

}
</style>