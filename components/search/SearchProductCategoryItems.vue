<template>
  <ul v-for="item in items" :key="item.key" class="search-category-item">
    <slot name="items" :item="item">
      <li class="search-category-item__item" :class="{ 'item--active': item.selected }">
        <div class="item" @click="emits('select', item)">
          <span class="item__label" v-html="item.key"></span>
          <span class="item__count">{{ item.count }}</span>
        </div>
        <search-product-category-items
          v-if="item.children"
          :items="item.children"
          @select="emits('select', $event)"
        ></search-product-category-items>
      </li>
    </slot>
  </ul>
</template>
<script lang="ts" setup>
import type { FacetItem } from './SearchProductCategoryFilter.vue'
const emits = defineEmits(['select'])
defineProps({
  items: {
    type: Object as PropType<FacetItem[]>,
    required: true
  }
})
</script>
