<template>
  <dynamic-zone v-if="page.content" :dynamic-zone="page.content" />
</template>
<script lang="ts">
import DynamicZone from './DynamicZone.vue'
import { PropType } from 'vue'
import { Page } from '~~/models/cms/Page'

export default {
  name: 'CmsPage',
  components: {
    'dynamic-zone': DynamicZone
  },
  props: {
    page: {
      type: Object as PropType<Page>,
      required: true
    }
  }
}
</script>
