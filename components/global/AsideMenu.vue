<template>
  <div class="aside-menu drawer">
    <input :id="name" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col">
      <div class="content" :class="classContent">
        <div class="content__button">
          <label :for="name" class="btn-ghost btn-square btn">
            <slot name="button"></slot>
          </label>
        </div>
        <div class="content__title">
          <slot name="title"></slot>
        </div>
        <div class="content__menu">
          <slot name="menu"></slot>
        </div>
        <slot name="content"></slot>
      </div>
    </div>
    <div class="drawer-side">
      <label :for="name" class="drawer-overlay"></label>
      <div class="bg-base-100">
        <div class="flex justify-between border-b py-2">
          <div class="flex px-3">
            <logo :height="50" />
          </div>
          <div class="flex">
            <label :for="name" class="btn-ghost btn-square btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                class="inline-block h-6 w-6 stroke-current"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </label>
          </div>
        </div>
        <slot name="menu" class="bg-red-500"></slot>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Logo from '~/components/global/Logo.vue'

export default {
  name: 'AsideMenu',
  components: {
    logo: Logo
  },
  props: {
    name: {
      type: String,
      default: 'AsideMenu'
    },
    classContent: {
      type: String,
      default: ''
    }
  },
  setup() {
    return {}
  }
}
</script>
<style lang="scss">
.aside-menu.drawer {
  @apply h-auto;
  overflow: visible;
  .drawer-content {
    overflow-y: visible;
    .content {
      &__button {
        @apply flex-none lg:hidden;
      }
      &__title {
        @apply mx-2 flex-1 px-2 lg:flex-none;
      }
      &__menu {
        @apply hidden flex-1 lg:flex;
      }
      &__content {
        @apply flex;
      }
    }
  }
  .drawer-toggle {
    &:checked ~ .drawer-side {
      @apply relative h-screen w-screen border;
    }
  }
  .drawer-side {
    @apply border lg:hidden;
    height: 0;
    width: 0;
  }
}
</style>
