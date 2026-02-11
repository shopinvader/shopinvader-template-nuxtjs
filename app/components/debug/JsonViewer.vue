<template>
  <ClientOnly>
    <template v-if="displayed">
      <div class="fixed bottom-3 right-3">
        <button
          type="button"
          class="btn btn-circle btn-warning text-white shadow-xl"
          @click="toggle = !toggle"
        >
          JSON
        </button>
      </div>
      <input id="my-modal-4" type="checkbox" class="modal-toggle" :checked="toggle" />
      <div class="modal cursor-pointer" @click="toggle = !toggle">
        <div class="modal-box relative w-11/12 max-w-5xl p-0">
          <div v-if="data" class="mockup-code">
            <pre
              v-if="data.constructor"
              data-prefix="Type"
              class="bg-warning text-warning-content"
            ><code>{{ data.constructor.name }}</code></pre>
            <pre><code>{{ data }}</code></pre>
          </div>
        </div>
      </div>
    </template>
  </ClientOnly>
</template>
<script lang="ts">
export default {
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  setup() {
    const displayed = ref(false)
    const toggle = ref(false)
    if (process?.env?.NODE_ENV === 'development') {
      displayed.value = true
    }
    return { toggle, displayed }
  }
}
</script>
