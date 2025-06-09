<template>
  <div class="card card-border bg-base-100 w-96">
  <div class="card-body">
    <h2 class="card-title">Card Title</h2>
    <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
    <div class="card-actions justify-end">
      <button class="btn btn-primary">Buy Now</button>
    </div>
  </div>
</div>
</template>
<script setup lang="ts">
definePageMeta({
  layout: null,
});
</script>