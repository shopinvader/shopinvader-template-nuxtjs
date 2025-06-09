<template>
  <footer class="footer">
    <div class="footer__body">
      <div class="body__logo">
        <slot name="logo">
          <logo></logo>
        </slot>
      </div>
      <div class="body__content">
        <!-- @slot footer content -->
        <slot name="content">
          <ul class="nav">
            <li v-for="category in categories" :key="category.id" class="nav_lv1">
              <nuxt-link :to="localePath(`/${category.urlKey}`)" class="lv1__label">
                {{ category.name }}
              </nuxt-link>
              <ul v-if="category.childs?.length > 0" class="nav_lv2">
                <li v-for="child1 in category.childs" :key="child1.id">
                  <nuxt-link :to="localePath(`/${child1.urlKey}`)" class="lv2__label">
                    {{ child1.name }}
                  </nuxt-link>
                </li>
              </ul>
            </li>
          </ul>
        </slot>
      </div>
    </div>
  </footer>
</template>
<script lang="ts" setup>
const { data:categories } = await useLazyAsyncData(
  'categories',
  async () => {
    const categoryService = useShopinvaderService('categories')
    return await categoryService.getNavCategories()
  }
)
</script>
<style>
@reference "@/assets/css/main.css";

.footer {
  @apply w-screen bg-white p-10;
  &__body {
    @apply container mx-auto p-4 py-10 flex max-md:flex-wrap;
    .body {
      &__logo {
        @apply w-full md:w-1/4;
      }
      &__content {
        ul.nav {
          @apply text-sm flex flex-wrap gap-x-10 gap-y-8;
          .lv1__label {
            @apply footer-title mb-3 block;
          }

          ul {
            @apply flex flex-col gap-1;
          }
        }
      }
    }
  }
}
</style>
