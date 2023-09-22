<template>
  <div class="aside-menu drawer" :class="{ 'side-menu': sideMenu }">
    <input :id="name" type="checkbox" class="drawer-toggle" v-model="isOpen" />
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
          <slot name="menu" context="content"></slot>
        </div>
        <slot name="content"></slot>
      </div>
    </div>
    <div class="drawer-side">
      <label :for="name" class="drawer-overlay"></label>
      <div class="side">
        <div class="side__header">
          <div class="header__title">
            <slot name="header"></slot>
          </div>
          <div class="header__close">
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
        <slot name="menu" context="side" class="bg-red-500"></slot>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: 'AsideMenu',
  props: {
    name: {
      type: String,
      default: 'AsideMenu'
    },
    classContent: {
      type: String,
      default: ''
    },
    sideMenu: {
      type: Boolean,
      default: true
    }
  },
  setup() {
    const isOpen = ref(false)
    const router = useRouter()
    watch(() => router.currentRoute.value, () => {
      isOpen.value = false
    })

    return {
      isOpen
    }
  }
}
</script>
<style lang="scss">
.aside-menu.drawer {
  @apply h-auto  transition duration-1000 ease-in;
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
    .nav > :where(li) > :where(ul) {
      @apply hidden;
    }
  }
  .drawer-toggle {
    &:checked ~ .drawer-side {
      @apply fixed top-0 h-screen w-screen md:w-[400px] border shadow;
    }
  }
  .drawer-side {
    @apply border;
    height: 0;
    width: 0;
    .side {
      @apply bg-base-100;
      &__header {
        @apply flex justify-between border-b py-2;
        .header__title {
          @apply flex px-3;
        }
      }
    }
  }
  &.side-menu {
    .drawer-content {
      .content {
        &__button {
          @apply flex-none lg:flex;
        }
        &__menu {
          @apply hidden;
        }
      }
    }
    .drawer-side {
      @apply border;
      height: 0;
      width: 0;
    }
  }
}
</style>
