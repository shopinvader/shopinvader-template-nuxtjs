<template>
  <header :class="{ scrolled: scrolled }">
    <aside-menu
      name="header"
      class="header"
      class-content="header-navbar"
      :sideMenu="scrolled"
    >
      <template #button>
        <div class="menu">
          <icon
            name="menu"
            class="text-3xl text-primary"
          />
        </div>
      </template>
      <template #header>
        <logo></logo>
      </template>
      <template #title>
        <nuxt-link :to="localePath({ name: 'index' })" class="logo">
          <logo></logo>
        </nuxt-link>
      </template>
      <template #content>
        <slot name="content">
          <div class="content__search">
            <search-autocomplete></search-autocomplete>
          </div>
          <div class="content__icons">
            <lazy-cart-icon />
            <lazy-header-user />
            <lazy-local-switcher />
          </div>
        </slot>
      </template>
      <template #menu="{context}">
        <slot name="menu">
          <header-nav :collapsible="context == 'side'"></header-nav>
        </slot>
      </template>
    </aside-menu>
  </header>
</template>
<script lang="ts" setup>
  const localePath = useLocalePath()
  let interval:any | null = null
  let scrolled = ref(false)
  let headerHeight: Number = 0
  let previsousScrollState = false
  const handleScroll = () => {
    let isScrolled = window.scrollY > 200
    if(isScrolled !== previsousScrollState) {
      scrolled.value = isScrolled
      previsousScrollState = isScrolled
      if(isScrolled) {
        headerHeight = document.querySelector('header')?.clientHeight || 0
        if(interval) clearTimeout(interval)
        interval = setTimeout(() => {
          scrolled.value = true
        }, 100)
      } else {
        headerHeight = 0
        scrolled.value = false
      }
      document.querySelector('body')?.style.setProperty('--header-height', `${headerHeight}px`)
    }
  }
  onMounted(() => {
    previsousScrollState = window.scrollY > 200
    window.addEventListener('scroll', handleScroll)
  })
</script>
<style lang="scss">
body {
  --header-height: 0;
  padding-top: var(--header-height);
}
header {
  @apply  top-0 z-40 border-b bg-white pb-2;
  &.scrolled {
    opacity: 0;
    animation-name: header-slide;
    animation-duration: 0.3s;
    animation-timing-function: ease-in-out;
    animation-fill-mode: both;
    animation-delay: .5s;
    @apply fixed shadow-xl;
    .header-navbar {
      .menu {
        @apply text-primary;
      }
      .logo {
        @apply max-w-lg;
        &__baseline {
          @apply hidden;
        }
      }
      .content {
        &__icons {
          .button {
            &__label {
              @apply opacity-0 transition-all duration-100 ease-in-out;
            }
          }
        }
      }
    }
  }
  .header-navbar {
    @apply navbar mx-auto  p-0 pt-2 lg:container lg:bg-transparent;
    display: grid;
    grid-template-columns: auto auto 1fr 1fr auto;
    @apply grid-flow-row;
    .content {
      &__button {
        @apply col-start-1 col-end-1;
      }

      &__title {
        @apply col-start-2 col-end-2 lg:row-span-2;
        .logo {
          @apply flex flex-col items-center;
          &__baseline {
            @apply max-md:hidden;
          }
        }
      }

      &__menu {
        @apply col-start-3 col-end-6 row-start-2;
      }

      &__search {
        @apply col-start-1 col-end-5 max-lg:row-start-2 max-lg:bg-slate-100 lg:col-start-3;
      }

      &__icons {
        @apply col-start-3 col-end-5 row-start-1 hidden items-center justify-end gap-2 px-2 md:flex lg:col-start-5;
        .button {
          &__icon {
            @apply rounded-full bg-primary p-1.5 text-4xl text-white;
          }
        }
      }
    }
  }

  .header {
    @apply max-md:sticky max-md:-top-14 max-md:z-10 max-md:bg-white;
  }
}
@keyframes header-slide {
  0% {
    opacity: 0;
    transform: translateY(-100%);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }

}
</style>
