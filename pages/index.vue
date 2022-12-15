<template>
  HOMEPAGE

</template>
<script lang="ts">
export default {
  name: 'index',
  data() {
    return {
      test: null
    }
  },
  computed: {
    user() {
      return useCurrentUser() || null
    }
  },
  methods: {
    async getUser() {
      const customerService = useShopinvaderServices()?.customer || {}
      console.log(await customerService.get())
    },
    async signin () {
      await useAuth()?.login()

    },
    async logout () {
      await useAuth()?.logout()

    }
  }
}
</script>
