<template>
  <div>
    <LazyContentDoc>
      <template #default="{ doc }">
        <ContentRenderer :value="doc" />
      </template>
      <template #not-found>
        <lazy-catalog-page />
      </template>
    </LazyContentDoc>
  </div>
</template>
<script setup lang="ts"></script>
