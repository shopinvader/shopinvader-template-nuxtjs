<template>
  <Teleport to="#header-target">
    <Transition name="aside-drawer">
      <div class="aside-drawer" v-if="open">
        <div class="aside-drawer__overlay" @click="$emit('close')"></div>
        <div class="aside-drawer__side">
          <div class="side__header">
            <div>
              <slot name="header" :open="open"></slot>
            </div>
            <icon icon="ic:round-close" class="text-3xl cursor-pointer" @click="$emit('close')"></icon>
          </div>
          <div class="side__content">
            <template v-if="open">
              <slot name="content" :open="open"></slot>
            </template>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
<script lang="ts">
import { defineNuxtComponent } from '#app'
import { Icon } from '@iconify/vue';
export default defineNuxtComponent({
  name: 'Drawer',
  emits: ['close'],
  components: {
    'icon': Icon
  },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    classContent: {
      type: String,
      default: ''
    }
  },
  setup() {
    return {
    }
  }
})
</script>
<style lang="scss">
.aside-drawer {
  @apply fixed top-0 left-0 flex justify-start items-start z-50;

  &__overlay {
    @apply h-screen w-screen bg-black opacity-25;
  }

  &__side {
    @apply absolute left-0 p-2 bg-white shadow-xl w-11/12 max-w-screen-sm h-screen overflow-y-auto;

    .side {
      &__header {
        @apply flex justify-between items-center p-4;
      }

      &__content {
        @apply flex flex-col justify-start items-start p-4;
      }
    }

  }

  &-enter-active,
  &-leave-active {
    transition: opacity 0.25s ease;

    .aside-drawer__side {

      transition: all 0.5s ease;
    }
  }

  &-enter-to,
  &-leave-from {
    opacity: 1;

    .aside-drawer__side {
      left: 0;
    }
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;

    .aside-drawer__side {
      left: -100%;
    }
  }
}
</style>
