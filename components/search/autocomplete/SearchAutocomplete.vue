<template>
  <div
    class="search-autocomplete"
    :class="{
      'search-autocomplete--focused': focused
    }"
  >
    <form @submit="submit" class="search-autocomplete__form">
      <div class="form">
        <span v-show="focused" class="form__back" @click="resetSearch">
          <Icon icon="ic:baseline-arrow-back" class="text-3xl" />
        </span>
        <label class="form__input">
          <input
            v-model="query"
            type="text"
            name="query"
            class="input"
            @focus="focused = true"
            @keydown="onKeySearch"
            autocomplete="off"
            :placeholder="$t('search.autocomplete.search')"
          />
          <span class="button" @click="resetSearch">
            <Icon
              v-if="!query"
              icon="ic:round-search"
              class="text-lg md:text-xl"
            />
            <Icon v-else icon="ic:round-close" class="text-lg md:text-xl" />
          </span>
        </label>
      </div>
      <ClientOnly>
        <Transition>
          <div v-show="focused" class="form__dropdown">
            <div class="dropdown__results">
              <div class="results__side">
                <div class="side__suggestions">
                  <autocomplete-suggestions
                    :suggestions="suggestions"
                    @click="onSuggestionClick"
                  ></autocomplete-suggestions>
                </div>
                <div class="side__queries">
                  <autocomplete-history
                    :query="searchedQuery"
                    @query-click="onSuggestionClick"
                  >
                  </autocomplete-history>
                </div>
                <div class="side__categories">
                  <autocomplete-categories :query="searchedQuery">
                  </autocomplete-categories>
                </div>
              </div>
              <div class="results__products">
                <autocomplete-products
                  :query="searchedQuery"
                  @set-suggestions="setSuggestions"
                  @go-search="goSearchPage"
                ></autocomplete-products>
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
import AutocompleteProducts from './AutocompleteProducts.vue'
import AutocompleteCategories from './AutocompleteCategories.vue'
import AutocompleteSuggestions from './AutocompleteSuggestions.vue'
import AutocompleteHistory from './AutocompleteHistory.vue'

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
  watch: {
    $route: {
      handler: function (val, old) {
        if (val?.path !== old?.path) {
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
      if (e.keyCode == 27) {
        this.focused = false
        return
      }
      if (this.timer) clearTimeout(this.timer)
      this.timer = setTimeout(async () => {
        await this.onSearch()
      }, 500)
    },
    onSearch() {
      this.searchedQuery = this.query || ''
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
    }
  }
}
</script>
<style lang="scss">
.search-autocomplete {
  @apply relative w-full;

  &__form {
    .form {
      &__input {
        @apply relative m-2 flex cursor-pointer items-center rounded bg-gray-100 md:rounded-full lg:m-1;
        .input {
          @apply input-xs flex-1 bg-transparent p-2 text-sm md:input-md;
          &:focus {
            outline: none;
          }
        }
        .button {
          @apply m-2 flex h-full justify-center rounded-full bg-secondary p-1 text-white md:p-2;
        }
      }
      &__dropdown {
        @apply p-1 md:p-3;
        .header {
          @apply flex items-center justify-between border-0 p-0 sm:p-2;
          .title {
            @apply font-heading w-full border-b py-2;
          }
        }
        .dropdown__results {
          @apply relative flex flex-wrap;
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
    }
  }
  &--focused {
    .search-autocomplete__form {
      @apply fixed top-0 left-0 z-40 max-xl:h-full max-xl:w-screen max-xl:overflow-auto max-xl:bg-white xl:relative ;
      .form {
        @apply flex w-full items-center;
        &__back {
          @apply cursor-pointer p-1 xl:hidden text-black;
        }
        &__input {
          @apply flex-1 rounded-xl border border-secondary bg-white transition-all z-50 w-full;
        }
        &__dropdown {
          @apply m-2 bg-white absolute xl:-top-5  xl:-left-2  xl:mt-5 xl:w-full xl:rounded-xl pt-20 xl:shadow-lg;

          &.v-enter-active {
            animation: dropdown 0.4s;
            animation-fill-mode: forwards;
          }
          &.v-leave-active {
            animation: dropdown 0.5s reverse;
          }
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
