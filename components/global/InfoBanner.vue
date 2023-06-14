<template>
  <div v-if="infosbanners?.length > 0" class="info-banner">
    <div
      v-for="(info, index) in infosbanners"
      :key="info.id"
      class="info-banner__message"
      :class="{
        'info-banner__message--active': selectedIndex === index
      }"
      v-html="info.message"
    ></div>
  </div>
</template>
<script lang="ts">
import { PropType } from 'vue'
import { InfoBanner } from '~~/models/cms/InfoBanner'
export default {
  props: {
    infos: {
      type: Object as PropType<InfoBanner>,
      default: null
    }
  },
  data() {
    return {
      selectedIndex: 0,
      timer: null as any
    }
  },
  computed: {
    infosbanners(): InfoBanner[] {
      return (
        this.infos?.filter(
          (a: InfoBanner) =>
            a.startDate <= new Date() && a.endDate >= new Date()
        ) || []
      )
    }
  },
  mounted() {
    this.timer = setInterval(() => {
      this.selectedIndex = this.selectedIndex + 1
      if (this.selectedIndex >= this.infosbanners.length) {
        this.selectedIndex = 0
      }
    }, 5000)
  },
  beforeUnmount() {
    clearInterval(this.timer)
  }
}
</script>
<style lang="scss">
.info-banner {
  @apply bg-secondary p-2;
  &__message {
    @apply hidden translate-x-3 text-center text-sm text-white transition-all;
    opacity: 0;
    animation: fade 600ms ease-in-out forwards;
    &--active {
      @apply visible block;
    }
    a {
      text-decoration: underline;
    }
  }
}
@keyframes fade {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
