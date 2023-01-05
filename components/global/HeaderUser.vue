<template>
  <div class="align-center relative flex">
    <template v-if="user == null">
      <button @click="signin">
        <Icon icon="ph:user" class="text-5xl" />
      </button>
    </template>
    <template v-else>
      <div class="dropdown-end dropdown">
        <label tabindex="0" class="btn-ghost btn text-info">
          <Icon icon="ph:user" class="text-5xl text-blue-500" />
        </label>
        <ul
          tabindex="0"
          class="dropdown-content menu rounded-box w-64 bg-base-100 shadow"
        >
          <li>
            <button type="button" @click="logout">
              {{ $t('account.logout') }}
            </button>
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
