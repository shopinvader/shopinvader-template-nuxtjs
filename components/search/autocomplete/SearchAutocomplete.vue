<template>
  <div
    class="search-autocomplete"
    :class="{
      'search-autocomplete--focused': focused,
      'search-autocomplete--active': active
    }"
  >
    <form @submit="submit" class="search-autocomplete__form">
      <div class="form">
        <span v-show="focused" class="form__back" @click="resetSearch">
          <icon name="left" class="text-3xl" />
        </span>
        <label class="form__input">
          <input
            v-model="query"
            type="text"
            name="query"
            class="search-input"
            @focus="focused = true"
            @keydown="onKeySearch"
            autocomplete="off"
            :placeholder="$t('search.autocomplete.search')"
          />
          <span class="button" @click="resetSearch">
            <Icon v-if="!query" name="search" class="text-lg md:text-xl" />
          </span>
        </label>
        <span v-show="focused" class="form__close" @click="resetSearch">
          <icon name="close-circle" class="text-2xl" />
        </span>
      </div>
      <ClientOnly>
        <Transition>
          <div v-show="focused" class="form__dropdown">
            <div class="dropdown__results">
              <div class="results__side">
                <div class="side__suggestions">
                  <autocomplete-suggestions
                    :suggestions="suggestions"
                    @select="onSuggestionClick"
                  ></autocomplete-suggestions>
                </div>
                <div class="side__queries">
                  <autocomplete-history :query="searchedQuery" @query-click="onSuggestionClick">
                  </autocomplete-history>
                </div>
                <div class="side__categories">
                  <autocomplete-categories :query="searchedQuery"> </autocomplete-categories>
                </div>
              </div>
              <div class="results__products">
                <div @click="focusOff">
                  <autocomplete-products
                    :query="searchedQuery"
                    @set-suggestions="setSuggestions"
                    @go-search="goSearchPage"
                  ></autocomplete-products>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </ClientOnly>
    </form>
    <div v-if="focused" class="backdrop" @click="focused = false"></div>
  </div>
</template>
<script lang="ts">
import AutocompleteCategories from './AutocompleteCategories.vue'
import AutocompleteHistory from './AutocompleteHistory.vue'
import AutocompleteProducts from './AutocompleteProducts.vue'
import AutocompleteSuggestions from './AutocompleteSuggestions.vue'

export default {
  name: 'SearchAutocomplete',
  components: {
    'autocomplete-products': AutocompleteProducts,
    'autocomplete-suggestions': AutocompleteSuggestions,
    'autocomplete-categories': AutocompleteCategories,
    'autocomplete-history': AutocompleteHistory
  },
  async setup() {
    const route = useRoute()
    const query = ref(route.query.q || '')

    return {
      query
    }
  },
  data() {
    return {
      focused: false,
      suggestions: [],
      total: null,
      loading: false,
      timer: null as any | null,
      searchedQuery: '' as string
    }
  },
  computed: {
    active() {
      return this.focused && this.query?.length > 0
    }
  },
  watch: {
    $route: {
      handler: function (val, old) {
        if (val?.fullPath !== old?.fullPath) {
          const query = (val.query.q || '') as string
          this.focused = false
          this.query = query
          this.searchedQuery = query
          if (this.timer) clearTimeout(this.timer)
        }
      }
    },
    focused: function (val) {
      if (val && this.total == null) {
        this.onSearch()
      }
    }
  },
  methods: {
    setSuggestions(suggestions: any) {
      this.suggestions = suggestions
    },
    onSuggestionClick(text: string) {
      this.query = text
      this.onSearch()
    },
    submit(e: any) {
      e?.preventDefault()
      e?.stopPropagation()
      this.goSearchPage()
    },
    async onKeySearch(e: KeyboardEvent) {
      this.loading = true
      this.focused = true
      // Manage escape key
      if (e.key === 'Escape') {
        this.focused = false
        return
      }
      if (this.timer) clearTimeout(this.timer)
      this.timer = setTimeout(async () => {
        await this.onSearch()
      }, 500)
    },
    onSearch() {
      this.searchedQuery = (this.query as string) || ''
    },
    goSearchPage() {
      this.focused = false
      const router = useRouter()
      const localePath = useLocalePath()
      router.push(localePath({ path: '/search', query: { q: this.query } }))
    },
    resetSearch() {
      this.query = ''
      this.focused = false
    },
    focusOff() {
      this.focused = false
    }
  }
}
</script>
<style lang="scss">
.search-autocomplete {
  @apply relative w-full;
  .backdrop {
    @apply fixed inset-0 z-30 bg-black/50;
  }
  &__form {
    .form {
      &__input {
        @apply input input-bordered relative flex items-center gap-2 pr-0;
        .search-input {
          @apply grow bg-transparent;
          &:focus {
            outline: none;
          }
        }
        .button {
          @apply btn btn-ghost btn-sm h-full text-primary;
        }
      }
      &__dropdown {
        @apply p-1 md:p-3;
        .header {
          @apply flex items-center justify-between border-0 p-0 sm:p-2;
          .title {
            @apply w-full border-b py-2 font-heading;
          }
        }
        .dropdown__results {
          @apply relative flex w-full flex-wrap;
          .results {
            &__side {
              @apply flex w-full flex-col md:w-1/3 md:border-r;
            }
            &__products {
              @apply md:w-2/3;
            }
          }
        }
      }
      &__close {
        @apply btn btn-circle ml-3;
      }
    }
  }
  &--focused {
    .search-autocomplete__form {
      @apply fixed -left-1/2 -right-1/2 top-0 z-40 mx-auto overflow-hidden bg-white lg:container max-lg:w-screen max-lg:overflow-auto lg:top-5 lg:max-w-screen-lg lg:rounded-2xl lg:p-2;
      .form {
        @apply z-50 flex w-full items-center transition-all max-lg:shadow;
        &__back {
          @apply cursor-pointer p-1 text-secondary lg:hidden;
        }
        &__input {
          @apply h-10 w-full rounded-2xl border border-secondary bg-transparent transition-all;
          .button {
            @apply flex items-center bg-transparent text-secondary;
          }
        }
      }
    }
  }
  &--active {
    .search-autocomplete__form {
      @apply h-screen max-h-screen lg:h-[90vh];
      .form__dropdown {
        @apply -z-10 mb-10 flex h-full overflow-auto max-lg:justify-center;
        .results__products {
          @apply max-lg:order-first;
        }
      }
    }
  }
}
@keyframes dropdown {
  0% {
    opacity: 0;
    overflow: hidden;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
