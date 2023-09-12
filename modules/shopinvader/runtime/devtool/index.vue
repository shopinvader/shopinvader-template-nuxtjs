<template>
  <div class="container flex flex-col gap-6 p-10">
    <div class="card shadow rounded-xl">
      <div class="card-body">
        <div class="card-title">
          <h2>API</h2>
        </div>
        <p>API URL: {{ data?.erp.api_url }}</p>
      </div>
    </div>
    <div class="card shadow rounded-xl">
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
          <table class="table w-100">
            <thead>
              <tr>
                <th>Name</th>
                <th>Index</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(name, index) in data?.elasticsearch.indices">
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
  layout: false,
})
let {data } = await useAsyncData(async ({ $shopinvader }) => {
  const config = await useRuntimeConfig()?.shopinvader
  return  config
})
</script>
