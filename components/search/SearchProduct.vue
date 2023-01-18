<template>
  <search-base
    :size="30"
    :provider="provider"
    :query="query"
    :sort-options="[
      { label: 'Relevance', value: '_score' },
      { label: 'Name', value: 'name' }
    ]"
  >
    <template #filters>
      <search-terms-aggregation
        name="categories"
        nested-path="categories"
        field="categories.name"
        title="Categories"
        :aggregation-query="categoryQuery"
        url-param="category"
      ></search-terms-aggregation>
      <search-terms-aggregation
        name="color"
        field="variant_attributes.color"
        title="Color"
        url-param="name"
      ></search-terms-aggregation>
      <search-range-aggregation
        :range-items="priceRangeFilter"
        name="price"
        field="price.default.value"
        title="Price"
        url-param="price"
      ></search-range-aggregation>
    </template>
    <template #header>
      <div class="pt-4">
        <slot name="header"></slot>
      </div>
      <search-selected-filters></search-selected-filters>
    </template>
    <template #items="{ items }">
      <div class="grid grid-cols-1 gap-1 sm:grid-cols-2 md:grid-cols-3">
        <ProductHit
          v-for="item in items"
          :key="item.id"
          :product="item"
          :inline="false"
        >
        </ProductHit>
      </div>
    </template>
    <template #footer>
      <slot name="footer"></slot>
    </template>
  </search-base>
</template>
<script lang="ts">
import ProductHit from '~/components/product/ProductHit.vue'
import { Product } from '~/models/Product'
import SearchSelectedFilters from '~~/components/search/SearchSelectedFilters.vue'
import SearchBaseVue from '~~/components/search/SearchBase.vue'
import SearchTermsAggregation from '~~/components/search/SearchTermsAggregation.vue'
import esb, { BoolQuery, TermQuery } from 'elastic-builder'

export default {
  components: {
    ProductHit,
    'search-base': SearchBaseVue,
    'search-terms-aggregation': SearchTermsAggregation,
    'search-selected-filters': SearchSelectedFilters
  },
  layout: 'default',
  props: {
    provider: {
      type: Function,
      required: true
    },
    query: {
      type: Function,
      required: false,
      default: () => {
        return esb.matchAllQuery()
      }
    }
  },
  data() {
    return {
      layout: 'grid',
      facets: {
        name: [],
        url: []
      },
      priceRangeFilter: [
        { to: 50, label: 'To 50€' },
        { from: 51, to: 100, label: 'From 51 to 100€' },
        { from: 101, to: 500, label: 'From 101 to 500€' },
        { from: 501, to: 1000, label: 'From 501 to 1000€' },
        { from: 1001, label: 'More than 1000€' }
      ]
    }
  },
  methods: {
    transformResult(result: any) {
      return result?.hits?.hits?.map((data: any) => new Product(data._source))
    },
    categoryQuery(query: BoolQuery) {
      if (query !== null) {
        query.must(new TermQuery('categories.level', '0'))
      } else {
        query = new BoolQuery().must(new TermQuery('categories.level', '0'))
      }
      return query
    }
  }
}
</script>
