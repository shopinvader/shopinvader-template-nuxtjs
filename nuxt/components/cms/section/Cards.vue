<template>
  <div class="section-cards">
    <div class="cards__title">{{ component.title }}</div>
    <div class="cards__list">
      <cms-card v-for="card in component.cards" :key="card.id" :card="card" />
    </div>
  </div>
</template>
<script lang="ts">
import { PropType } from 'vue'
import CmsCard from '~/components/cms/shared/CmsCard.vue'
import { Cards as CardsModel } from '~~/models/cms/section/Cards'
export default {
  name: 'Cards',
  fetchKey: 'Cards',
  components: {
    'cms-card': CmsCard
  },
  props: {
    component: {
      type: Object as PropType<CardsModel>,
      required: true
    }
  }
}
</script>
<style lang="scss">
.section-cards {
  @apply py-4 md:py-7;
  .cards {
    &__title {
      @apply text-lg font-bold;
    }
    &__list {
      @apply grid grid-cols-2 gap-4 pt-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5;
    }
  }
}
</style>
