<template>
  <div class="container flex flex-col gap-6 p-10">
    <div class="card rounded-xl shadow">
      <div class="card-body">
        <div class="card-title">
          <h2>API</h2>
        </div>
        <p>API URL: {{ data?.erp.url }}</p>
      </div>
    </div>
    <div class="card rounded-xl shadow">
      <div class="card-body">
        <div class="card-title">
          <h2>Elastic</h2>
        </div>
        <p>
          Elastic URL:
          <a :href="data?.elasticsearch.url">
            {{ data?.elasticsearch.url }}
          </a>
        </p>
        <div>
          <table class="w-100 table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Index</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(name, index) in data?.elasticsearch.indices" :key="index">
                <td>{{ name }}</td>
                <td>{{ index }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="mockup-code">
      <pre><code>{{ data }}</code></pre>
    </div>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  layout: false
})
const { data } = await useAsyncData(async () => {
  const config = await useRuntimeConfig()?.shopinvader
  return config
})
</script>
