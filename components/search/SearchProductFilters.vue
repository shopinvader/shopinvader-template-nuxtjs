<template>
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
  <search-range-price
    name="price"
    field="price.default.value"
    :title="$t('filters.price')"
    :close="false"
    url-param="price"
  ></search-range-price>
</template>
<script lang="ts">
import { BoolQuery, TermQuery } from 'elastic-builder'
export default({
  methods: {
    categoryQuery(query: BoolQuery) {
      if (query !== null) {
        query.must(new TermQuery('categories.level', '0'))
      } else {
        query = new BoolQuery().must(new TermQuery('categories.level', '0'))
      }
      return query
    }
  }
})
</script>
