<template>
  <client-only fallback-tag="div">
    <template #fallback>
      <div class="account-layout__loading">
        <spinner />
      </div>
    </template>
    <div class="account-layout">
      <template v-if="user">
        <slot v-if="navbar" name="navbar">
          <account-navbar
            v-if="items && items?.length > 0"
            :items="items"
            :selected="slug"
            class="account-layout__navbar"
          >
            <template #extra="{ pages }">
              <li v-if="pages.length > 0" class="extra">
                <button @click="logout" class="head__logout">
                  <icon name="logout" class="" />
                  {{ $t('account.logout') }}
                </button>
              </li>
            </template>
          </account-navbar>
        </slot>
        <div class="account-layout__main">
          <div class="main__head">
            <slot name="title">
              <div class="head__back">
                <nuxt-link :to="localePath('account')">
                  <icon name="left"></icon>
                </nuxt-link>
              </div>
              <template v-if="currentPage">
                <div class="head">
                  <icon class="head__icon" :name="currentPage.icon"></icon>
                  <h1 class="head__title">
                    {{ currentPage?.title }}
                  </h1>
                  <button @click="logout" class="head__logout">
                    <icon name="logout" class="" />
                    {{ $t('account.logout') }}
                  </button>
                </div>
              </template>
            </slot>
          </div>
          <div v-if="!loading" class="main__content">
            <slot name="content" :items="items"></slot>
          </div>
          <div v-else class="main__loading">
            <spinner />
          </div>
        </div>
      </template>
      <template v-else-if="!loading">
        <div class="account-layout__no-user">
          <p>{{ $t('account.no_user') }}</p>
          <button @click="login" class="btn btn-primary">
            {{ $t('account.login.title') }}
          </button>
        </div>
      </template>
    </div>
  </client-only>
</template>
<script lang="ts" setup>
const props = defineProps({
  slug: {
    type: String,
    required: true
  },
  navbar: {
    type: Boolean,
    default: true
  }
})
const auth = useShopinvaderService('auth')
const localePath = useLocalePath()
const { t } = useI18n()

const loading = ref(false)
const user = auth?.getUser()
const items = ref([
  {
    title: t('account.profile.title'),
    icon: 'profile',
    slug: 'account-profile'
  },
  {
    title: t('account.address.title'),
    icon: 'addresses',
    slug: 'account-addresses'
  },
  {
    title: t('account.sales.title'),
    icon: 'sales',
    slug: 'account-sales'
  }
])
const login = async () => {
  loading.value = true
  try {
    const localePath = useLocalePath()
    await auth?.loginRedirect(localePath({ name: 'account' }))
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
const logout = async () => {
  if (!auth) return console.error('Auth service not found')
  loading.value = true
  try {
    await auth.logoutRedirect()
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
const currentPage = computed(() => {
  return items.value.find((item) => item.slug === props.slug) || null
})
</script>
<style lang="scss">
.account-layout {
  @apply w-full gap-1 lg:flex;
  &__loading {
    @apply flex h-96 items-center justify-center;
  }
  &__navbar {
    @apply lg:w-1/3 lg:p-3 xl:w-1/4;
  }
  &__main {
    @apply w-full;
    .main {
      &__head {
        @apply flex items-start gap-2 border-b p-3 text-xl max-sm:shadow sm:items-center md:pb-3 lg:text-3xl;
        .head {
          @apply flex w-full flex-wrap justify-between gap-2 sm:items-center;
          &__icon {
            @apply text-2xl md:text-4xl;
          }
          &__title {
            @apply m-0 flex-1 p-0 text-lg sm:text-xl md:text-4xl;
          }
          &__back {
            @apply cursor-pointer text-primary lg:hidden;
          }
          &__logout {
            @apply btn btn-primary sm:btn-sm max-sm:hidden;
          }
        }
      }
      &__content {
        @apply container mx-auto min-h-screen p-3;
      }
      &__loading {
        @apply flex min-h-36 items-center justify-center pt-10;
      }
    }
  }
  &__no-user {
    @apply flex min-h-64 w-full flex-col items-center justify-center gap-2 text-center;
  }
}
</style>
