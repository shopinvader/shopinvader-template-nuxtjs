<template>
  <div class="align-center relative flex">
    <template v-if="user == null">
      <button @click="signin">
        <Icon icon="ph:user" class="text-5xl" />
      </button>
    </template>
    <template v-else>
      <div class="dropdown dropdown-end">
        <label tabindex="0" class="btn-ghost btn text-info">
          <Icon icon="ph:user" class="text-3xl text-blue-500 lg:text-5xl" />
        </label>
        <ul
          tabindex="0"
          class="dropdown-content menu rounded-box w-64 bg-base-100 shadow"
        >
          <li>
            <nuxt-link to="/account/profile">
              {{ $t('account.title') }}
            </nuxt-link>
          </li>
          <li>
            <button type="button" @click="logout">
              {{ $t('account.logout') }}
            </button>
          </li>
          <li>
            <nuxt-link to="/account/addresses">
              {{ $t('account.address.title') }}
            </nuxt-link>
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>
<script lang="ts">
export default defineNuxtComponent({
  name: 'HeaderUser',
  computed: {
    user() {
      return useCurrentUser() || null
    }
  },
  methods: {
    async signin() {
      await useAuth()?.login()
    },
    async logout() {
      await useAuth()?.logout()
    },
    async info() {
      await useAuth()?.getUser()
    }
  }
})
</script>
