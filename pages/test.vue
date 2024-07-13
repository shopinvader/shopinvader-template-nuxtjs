<template>
  <div>
    {{ data }}
  </div>
</template>
<script lang="ts" setup>
const localePath = useLocalePath()
/** Get path without locale Prefix */
let localeRoute: string = localePath('/')
if (localeRoute == '/') {
  localeRoute = ''
}
const path = 'equipements/divers/chemise-pattes-epaules-2-poches-ml-col-ferme-femme-1441130'
const { data } = await useAsyncData('entity', async () => {
  const catalog = useShopinvaderService('catalog')
  const sku = '1441130T038C004WN'
  const entity = await catalog.getEntityByURLKey(path, sku)
  return entity
})
</script>
