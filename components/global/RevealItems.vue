<template>
  <div ref="el" class="reveal" :class="{'reveal--init': init}">
    <slot></slot>
  </div>
</template>
<script lang="ts">
export default {
  name: 'RevealItems',
  props: {
    selector: {
      type: String,
      required: true
    },
    scroll: {
      type: Boolean,
      required: false,
      default: true
    }
  },

  setup(props, ctx) {
    const { animation } = useAppConfig()
    const hasAnimation = animation?.reveals || true
    const init = ref(false)
    const shown = ref(false)
    const observer = ref(null) as Ref<IntersectionObserver | null>
    const el = ref(null)

    const initSelector = () => {
      const items = el.value.querySelectorAll(props.selector)
      let index = 0
      items.forEach((item:HTMLElement) => {
        if(item.classList.contains('reveal__items--visible')) return
        if(!init.value) init.value = true
        item.classList.add('reveal__items')
        if(shown.value) {
          setTimeout(() => {
            item.classList.add('reveal__items--visible')
          }, 300+index*100)
          index++
        }
      })
    }
    if(!hasAnimation) {
      init.value = true
      shown.value = true
    }
    return {
      el,
      init,
      shown,
      observer,
      initSelector
    }
  },
  watch: {
    shown() {
      const items = this.el.querySelectorAll(this.selector)
      let index = 0
      items.forEach((item:HTMLElement) => {
        if(item.classList.contains('reveal__items--visible')) return
        setTimeout(() => {
          item.classList.add('reveal__items--visible')
        }, 300+index*100)
        index++
      })
      if(this.observer) {
        this.observer.unobserve(this.el)
      }
    }
  },
  updated() {
    this.initSelector()
  },
  mounted() {
    this.initSelector()
    if(this.scroll) {
      this.shown = true
      return
    }
    this.observer = new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.shown = true
          }
        })
      },
      {
        rootMargin: "30px 0px",
        threshold: 1
      }
    )
    this.observer.observe(this.el)
  },
  onBeforeUnmount() {
    if(this.observer) {
      this.observer.unobserve(this.el)
    }
  }
}
</script>
<style lang="scss">
  .reveal {
    @apply opacity-0;
    &--init {
      @apply opacity-100;
    }
    &__items {
      @apply opacity-0 transition-all duration-500 ease-in-out border translate-y-32;
      &--visible {
        @apply opacity-100 mb-0 translate-y-0;
      }
    }
  }
</style>
