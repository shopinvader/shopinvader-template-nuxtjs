<template>
  <div v-show="length > 0">
    <div class="header">
      <div class="title">
        {{ $t('search.autocomplete.suggestions') }}
      </div>
    </div>
    <ul class="autocomplete-suggestion">
      <template v-for="suggestion in suggestions">
        <li
          v-for="option in suggestion.options"
          :key="option.text"
          @click="onSuggestionClick(option.text)"
        >
          <b> {{ option.text.slice(suggestion.offset, suggestion.length) }} </b
          >{{ option.text.slice(suggestion.offset + suggestion.length) }}
        </li>
      </template>
    </ul>
  </div>
</template>
<script lang="ts">
import { PropType } from 'vue'
export default {
  name: 'AutocompleteSuggestions',
  events: ['click'],
  props: {
    suggestions: {
      type: Object as PropType<any[]>,
      required: true
    }
  },
  computed: {
    length() {
      return this.suggestions.reduce((acc, suggestion) => {
        return acc + suggestion.options.length
      }, 0)
    }
  },
  methods: {
    onSuggestionClick(text: string) {
      this.$emit('click', text)
    }
  }
}
</script>

<style lang="scss">
.autocomplete-suggestion {
  @apply flex flex-col gap-2 p-2;
  li {
    @apply cursor-pointer hover:underline;
  }
}
</style>
