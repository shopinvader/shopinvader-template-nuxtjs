<template>
  <div>
    {{ $t('pagination.status', { boundStart, boundStop, totalItems }) }}
  </div>
</template>

<script lang="ts">
export default defineNuxtComponent({
  props: {
    page: {
      type: Number,
      required: false,
      default: 1
    },
    perPage: {
      type: Number,
      required: false,
      default: 10
    },
    totalItems: {
      type: Number,
      required: true,
      default: 100
    }
  },
  setup(props) {
    const boundStart = computed(() => {
      return props.perPage * (props.page - 1) + 1
    })
    const boundStop = computed(() => {
      return props.perPage * props.page > props.totalItems
        ? props.totalItems
        : props.perPage * props.page
    })

    return {
      boundStart,
      boundStop
    }
  }
})
</script>
