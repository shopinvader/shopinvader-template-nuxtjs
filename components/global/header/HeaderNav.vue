<template>
  <nav class="navbar" :class="`navbar--${status}`">
    <ul class="navbar__level1">
      <li
        v-for="(level1, index) in categories"
        :key="level1.id"
        :tabindex="index"
        class="level1__item"
        :class="{
          'level1__item--active': hoverIndex == level1.id,
          'level1__item--clicked': clickedIndex == level1.id
        }"
        @mouseover="hoverIndex = level1.id"
        @mouseleave="hoverIndex = null"
      >
        <div class="item__link">
          <nuxt-link :to="localePath({ path: '/' + level1.urlKey })">
            {{ level1.name }}
          </nuxt-link>
          <button
            type="button"
            class="btn btn-ghost btn-sm"
            :aria-label="level1.name"
            @click="clickedIndex = clickedIndex == level1.id ? null : level1.id"
          >
            <icon name="right" />
          </button>
        </div>
        <ul v-if="level1.childs?.length > 0" :tabindex="index" class="item__level2">
          <li v-for="level2 in level1.childs" :key="level2.id" class="level2__item">
            <div class="item__link">
              <nuxt-link :to="localePath({ path: '/' + level2.urlKey })">
                {{ level2.name }}
              </nuxt-link>
            </div>
            <ul v-if="level2?.childs?.length && level2?.childs?.length > 0" class="item__level3">
              <li v-for="level3 in level2.childs" :key="level3.id" class="level3__item">
                <nuxt-link class="item__link" :to="localePath({ path: '/' + level3.urlKey })">
                  {{ level3.name }}
                </nuxt-link>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>
<script lang="ts" setup>
const localePath = useLocalePath()
const hoverIndex = ref<number | null>(null)
const clickedIndex = ref<number | null>(null)
const { data: categories, status } = await useLazyAsyncData('categories', async () => {
  const categoryService = useShopinvaderService('categories')
  return await categoryService.getNavCategories()
})
</script>
<style lang="scss">
.drawer-content {
  .navbar {
    &--pending {
      @apply min-h-16 opacity-50;
    }
    @apply flex flex-1 justify-start p-0;
    .navbar__level1 {
      position: unset !important;
      .level1__item {
        @apply transition duration-150 ease-out hover:ease-in;
        & > .item__link {
          @apply m-1 px-2 py-3 text-sm font-semibold;
          .btn {
            @apply hidden;
          }
        }
        & > .item__level2 {
          @apply hidden;
        }
        &--active {
          & > .item__link {
            @apply rounded-t-xl bg-primary text-white shadow-2xl;
          }
          & > .item__level2 {
            @apply menu card card-body absolute -left-1/2 -right-1/2 z-[1] m-auto -mt-2 flex min-h-[20vw] w-full flex-row flex-wrap bg-primary p-2 text-white shadow-2xl lg:p-4 xl:p-8;
            a {
              @apply hover:text-white hover:underline;
            }
            .level2__item {
              & > .item__link {
                @apply font-bold hover:text-white hover:underline;
              }
            }
            .item__level3 {
              @apply ml-0 pl-0;
            }
          }
        }
      }
    }
  }
}
.drawer-side {
  width: 100vw !important;
  .side {
    @apply h-screen min-w-[420px] overflow-auto;
    .navbar {
      ul.navbar__level1 {
        @apply flex w-full flex-col items-center justify-center;
        .level1__item {
          @apply w-full flex-grow border-b py-1 text-sm;
          &:hover {
            @apply cursor-pointer;
          }
          .item__link {
            @apply flex justify-between;
          }
          .item__level2 {
            @apply hidden;
          }
          &--clicked {
            & > .item__link {
              @apply font-bold;
              .btn {
                @apply rotate-90;
              }
            }
            .item__level2 {
              @apply flex flex-col pl-3;
              .level2__item {
                @apply border-b-0 py-2;
              }
              ul {
                @apply pl-3;
                li {
                  @apply py-2;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
