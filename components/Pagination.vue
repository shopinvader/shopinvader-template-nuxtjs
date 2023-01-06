<template>
  <div class="flex gap-1 items-center">
    <btn v-if="goToFirst" outline size="small" @click="$emit('change', 1)">
      &laquo;
    </btn>
    <btn
      v-if="goToFirst"
      outline
      size="small"
      @click="$emit('change', page - 1)"
    >
      &lt;
    </btn>
    <template v-for="(i, index) in pagination">
      <div v-if="i === -1" :key="'ellipsis' + index" class="p-3">...</div>
      <btn
        v-else
        :key="i"
        :outline="i !== page"
        size="small"
        @click="$emit('change', i)"
      >
        {{ i }}
      </btn>
    </template>
    <btn
      v-if="goToLast"
      outline
      size="small"
      @click="$emit('change', page + 1)"
    >
      &gt;
    </btn>
    <btn
      v-if="goToLast"
      outline
      size="small"
      @click="$emit('change', totalPage)"
    >
      &raquo;
    </btn>
  </div>
</template>
<script lang="ts">
import Btn from "./Btn.vue";

export default defineNuxtComponent({
  components: { Btn },
  props: {
    page: {
      type: Number,
      required: false,
      default: 1,
    },
    perPage: {
      type: Number,
      required: false,
      default: 10,
    },
    totalItems: {
      type: Number,
      required: true,
      default: 100,
    },
  },
  setup(props) {
    const totalPage = computed(() => {
      return Math.ceil(props.totalItems / props.perPage) as number
    })
    const pagination = computed(() => {
      const current = props.page;
      const last = totalPage;
      const delta = 2;
      const left = current - delta;
      const right = current + delta + 1;
      const range = [];
      const rangeWithDots: number[] = [];
      let l;

      for (let i = 1; i <= last.value; i++) {
        if (i === 1 || i === last.value || (i >= left && i < right)) {
          range.push(i);
        }
      }

      for (const i of range) {
        if (l) {
          if (i - l === 2) {
            rangeWithDots.push(l + 1);
          } else if (i - l !== 1) {
            rangeWithDots.push(-1);
          }
        }
        rangeWithDots.push(i);
        l = i;
      }

      return rangeWithDots as number[]
    })

    const goToFirst= computed(()=> {
      return props.page > 1 as boolean 
    })

    const goToLast = computed(()=> {
      return props.page < totalPage.value 
    })

    return {
      totalPage,
      pagination,
      goToFirst,
      goToLast
    }
  }
});
</script>
