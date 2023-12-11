<template>
  <div v-show="items.length > 0">
    <div class="header">
      <div class="title">
        {{ $t('search.autocomplete.queries') }}
      </div>
    </div>
    <ul class="autocomplete-history">
      <li v-for="item in items" :key="item" class="autocomplete-history__item">
        <span class="item__label">
          <icon name="history"></icon>
          <a @click="onQueryClick(item)">{{ item }}</a>
        </span>
        <button
          type="button"
          @click="removeItem(item)"
          class="btn-link text-black"
        >
          <icon name="close-circle" class=""></icon>
        </button>
      </li>
    </ul>
    <div class="flex justify-end p-3 text-xs">
      <button @click="removeAllItem" class="btn-link text-black">
        {{ $t('search.autocomplete.clear') }}
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import { useHistoryStore } from '~/stores/history'
interface Props {
  query: string
}
export default {
  name: 'AutocompleteHistory',

  props: {
    query: {
      type: String,
      required: true
    }
  },
  emits: ['query-click'],
  setup(props: Props, { emit }) {
    const store = useHistoryStore()
    const removeItem = (item: string) => {
      store.removeQuery(item)
    }

    const removeAllItem = () => {
      store.removeAllQuery()
    }

    const onQueryClick = (query: string) => {
      emit('query-click', query)
    }

    const items = computed((): string[] => {
      return store.getQueries
    })

    watch(props, (props) => {
      const { query = '' } = props
      store.addQuery(query)
    })

    return {
      onQueryClick,
      removeItem,
      removeAllItem,
      items
    }
  }
}
</script>
<style lang="scss">
.autocomplete-history {
  &__item {
    @apply flex items-center justify-between p-1;
    .item {
      &__label {
        @apply flex cursor-pointer items-center gap-2 hover:text-primary;
        a {
          @apply text-sm;
        }
      }
    }
  }
}
</style>
