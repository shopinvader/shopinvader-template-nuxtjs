<template>
  <card :style="card.style">
    <template #figure>
      <cms-image v-if="card.image" :image="card.image" />
    </template>
    <template #body>
      <div class="font-bold">{{ card.title }}</div>
      {{ card.content }}
      <div v-if="card.cta" class="card-actions justify-end">
        <cms-cta :cta="card.cta" />
      </div>
    </template>
  </card>
</template>
<script lang="ts">
import { PropType } from 'vue'
import { Card as CardModel } from '~/models/cms/Card'
import Card from '~~/components/global/Card.vue'
import CTA from '~/components/cms/shared/CTA.vue'
import Image from '../shared/Image.vue'
export default {
  name: 'Cards',
  fetchKey: 'Cards',
  components: {
    card: Card,
    'cms-image': Image,
    'cms-cta': CTA
  },
  props: {
    card: {
      type: Object as PropType<CardModel>,
      required: true
    }
  }
}
</script>
