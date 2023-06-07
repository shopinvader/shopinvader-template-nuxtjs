<template>
  <div class="bg-gray-800 text-white">
    <footer class="footer">
      <div>
        <cms-image v-if="footer?.logo" :image="footer.logo"></cms-image>
        <div v-if="footer?.baseline" class="max-md:hidden">
          {{ footer.baseline }}
        </div>
      </div>
      <div v-for="col in footer.content" :key="col.id">
        <span class="footer-title">{{ col.title }}</span>
        <p v-html="markdown(col.text)" />
      </div>
    </footer>
  </div>
</template>
<script lang="ts">
import { Footer } from '~~/models/cms/Footer'
import ImageVue from '~~/components/cms/shared/Image.vue'
export default defineNuxtComponent({
  name: 'global-footer',
  components: {
    'cms-image': ImageVue
  },
  data() {
    return {
      footer: {} as Footer
    }
  },
  async asyncData() {
    const { getFooter } = useCMS()
    return {
      footer: (await getFooter()) || null
    }
  }
})
</script>
<style lang="scss">
.footer {
  @apply container mx-auto bg-gray-800 p-4 py-10;
}
</style>
