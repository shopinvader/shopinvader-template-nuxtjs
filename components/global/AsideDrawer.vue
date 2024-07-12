<template>
  <Teleport to="#header-target">
    <Transition name="aside-drawer">
      <div v-if="open" class="aside-drawer" :class="`aside-drawer--${direction}`">
        <div class="aside-drawer__overlay" @click="$emit('close')"></div>
        <div class="aside-drawer__side" :class="[`aside-drawer__side--${direction}`, classContent]">
          <div class="side__header">
            <div>
              <slot name="header" :open="open"></slot>
            </div>
            <icon name="close" class="cursor-pointer text-3xl" @click="$emit('close')"></icon>
          </div>
          <div class="side__content">
            <template v-if="open">
              <slot name="content" :open="open"></slot>
            </template>
          </div>
          <div class="side__footer">
            <template v-if="open">
              <slot name="footer" :open="open"></slot>
            </template>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
<script lang="ts">
import { defineNuxtComponent } from '#app'
export default defineNuxtComponent({
  name: 'Drawer',
  emits: ['close'],
  props: {
    open: {
      type: Boolean,
      default: false
    },
    classContent: {
      type: String,
      default: ''
    },
    direction: {
      type: String,
      default: 'left'
    }
  },
  watch: {
    open: {
      immediate: true,
      handler(open) {
        if(document?.body) {
          if (open) {
            document.body.classList.add('aside--opened')
          } else {
            document.body.classList.remove('aside--opened')
          }
        }
      }
    }
  },
  setup() {
    return {}
  }
})
</script>
<style lang="scss">
body {
  &.aside--opened {
    @apply max-h-screen overflow-hidden;
  }
}

.aside-drawer {
  @apply fixed top-0 z-50 flex items-start;
  &--right {
    @apply justify-end;
    .aside-drawer__side {
      @apply right-0;
    }
  }

  &--left {
    @apply left-0 justify-start;
    .aside-drawer__side {
      @apply left-0;
    }
    .aside-drawer {
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
  }

  &__overlay {
    @apply h-screen w-screen bg-black opacity-25;
  }

  &__side {
    @apply absolute flex h-screen w-11/12 max-w-screen-sm flex-col overflow-y-auto bg-white shadow-xl;

    .side {
      &__header {
        @apply flex items-center justify-between p-6;
      }

      &__content {
        @apply flex flex-grow flex-col items-start justify-start overflow-auto p-6;
      }

      &__footer {
        @apply flex w-full items-end justify-end gap-4 bg-white p-4 drop-shadow-2xl;
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
      &--left {
        left: 0;
      }
      &--right {
        right: 0;
      }
    }
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;

    .aside-drawer__side {
      &--left {
        left: -100%;
      }
      &--right {
        right: -100%;
      }
    }
  }
}
</style>
