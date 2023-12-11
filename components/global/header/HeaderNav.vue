<template>
  <nav class="navbar">
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
          <button type="button" class="btn btn-ghost btn-sm" @click="clickedIndex = clickedIndex == level1.id ? null : level1.id">
            <icon name="right" />
          </button>
        </div>
        <ul
          v-if="level1.childs?.length > 0"
          :tabindex="index"
          class="item__level2"
        >
          <li
            v-for="level2 in level1.childs"
            :key="level2.id"
            class="level2__item"
          >
            <div class="item__link">
              <nuxt-link :to="localePath({ path: '/' + level2.urlKey })">
                {{ level2.name }}
              </nuxt-link>
            </div>
            <ul v-if="level2?.childs?.length > 0" class="item__level3">
              <li
                v-for="level3 in level2.childs"
                :key="level3.id"
                class="level3__item"
              >
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
<script lang="ts">
import { Category } from '#models'

export default defineNuxtComponent({
  fetchKey: 'category',
  data() {
    return {
      categories: [] as Category[]
    }
  },
  async asyncData() {
    let categories: Category[] = []
    try {
      const categoryService = useShopinvaderService('categories')
      const result = await categoryService?.search({
        size: 10,
        query: {
          term: {
            level: 0
          }
        }
      })
      categories = result?.hits || []
    } catch (error) {
      categories = []
      console.error(error)
    }

    return {
      categories
    }
  },
  setup() {
    const localePath = useLocalePath()
    const hoverIndex = ref<number | null>(null)
    const clickedIndex = ref<number | null>(null)
    return {
      localePath,
      hoverIndex,
      clickedIndex
    }
  }
})
</script>
<style lang="scss">
.drawer-content {
  .navbar {
    @apply flex justify-start flex-1 p-0 relative;
    .navbar__level1 {
      position: unset !important;
      .level1__item {
        @apply transition duration-150 ease-out hover:ease-in;
        & > .item__link {
          @apply m-1 text-sm font-semibold uppercase px-1 py-3;
          .btn {
            @apply hidden;
          }
        }
        & > .item__level2 {
          @apply hidden;
        }
        &--active {
          & > .item__link {
            @apply bg-primary text-white;
          }
          & > .item__level2 {
            @apply flex flex-row flex-wrap absolute bg-primary -mt-1 text-white z-[1] m-auto menu p-2 shadow rounded-box w-full -left-1/2 -right-1/2 min-h-[20vw];
            .level2__item {
              & > .item__link {
                @apply font-bold;
              }
            }
            .item__level3 {
              @apply ml-0 pl-0 ;
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
        @apply flex flex-col justify-center items-center w-full;
        .level1__item {
          @apply text-sm border-b py-1 w-full flex-grow;
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
              @apply flex flex-col border-l border-black pl-3 ;
              .level2__item {
                @apply border-b py-2;
              }
              ul {
                @apply pl-3;
                li {
                  @apply py-2 ;
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
