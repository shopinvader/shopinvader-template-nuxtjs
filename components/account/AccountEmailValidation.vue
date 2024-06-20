<template>
  <section
    v-if="auth?.type=='credentials'"
    class="section-bkg"
  >
  
    <slot name="token-error-msg">
      <div v-if="!urlHasToken" class="token__msg">
        <div class="message-wrapper">
          <div class="message-btn ">
            <nuxt-link
              :to="localePath('/')"
              class="message-btn__style "
            >
              <icon name="material-symbols:arrow-back-ios" class="inline"> </icon>
              {{ $t('btn.back_to_homepage') }}
            </nuxt-link>
          </div>
          <div class="message-wrapper" >
            <div class="message-content">
              <div
                class="message-content__wrapper "
              >
                <div class="message-icon">
                  <icon
                    name="close"
                    class="message-icon__style icon-error"
                  >
                  </icon>
                </div>
                <div class="message-text ">
                  {{ $t('account.register.notification_token_error') }}
                </div>
                <div>
                  {{ $t('account.register.notification_token_error_info') }}
                </div>
              </div>
            </div>
           </div>
        </div>
      </div>
    </slot>
    <slot name="token-success-msg">
      <div v-if="registrationSuccess" class="token__msg ">
        <div class="message-wrapper" >
          <div class="message-content">
              <div
                  class="message-content__wrapper"
                >
                  <div class="message-icon">
                    <icon name="check" class="message-icon__style icon-success"> 

                    </icon>
                  </div>
                  <div class="message-text ">
                    {{ $t('account.register.notification_registration_thankyou') }}
                  </div>
                  <div class="">
                    {{ $t('account.register.notification_token_success_msg') }}
                  </div>
                  <nuxt-link
                    :to="localePath('/account/login')"
                    class="message-btn "
                  >
                    {{ $t('account.login.title') }}
                  </nuxt-link>
              </div>
            </div>
          </div>
        </div>
      </slot>
  </section>
</template>

<script lang="ts">
import { AuthCredentialService } from '#services'
import { defineComponent } from 'vue'
import { ref } from 'vue'

export default defineComponent({
  name: 'AccountEmailValidation',
  async setup() {
    const auth = useShopinvaderService('auth') as AuthCredentialService
    let urlHasToken = ref<boolean>(false)
    let registrationSuccess = ref<boolean>(false)
    const route = useRoute()
   
    if (!route.query.token) {
      urlHasToken.value = false
    } else if (route.query.token) {
      urlHasToken.value = true
      try {
        const response = (await auth?.validateEmail(
          route.query.token
        ))
        if (response) {
          registrationSuccess.value = true
        }
      } catch (error) {
        registrationSuccess.value =  false
        urlHasToken.value = false
        console.log("error", error)
      }

    }
    return {
      urlHasToken,
      registrationSuccess,
      auth
    }
  }
})
</script>
<style lang="scss">
.section-bkg {
  @apply flex h-screen flex-col items-center overflow-hidden bg-gradient-to-tr from-gray-400 via-yellow-50 to-gray-400 py-10;
  .token {
    &__msg {
      @apply container mx-auto px-4;
      .message-wrapper {
        @apply rounded-3xl bg-white p-10;
        .message-btn {
          @apply py-4 text-left;
          &__style {
           @apply btn-primary btn-sm btn rounded-full text-white;
          }
        }
        .message-content {
          @apply my-8 flex flex-wrap md:items-center; 
          &__wrapper {
            @apply w-full rounded-3xl bg-gray-100 px-8 py-20 text-center lg:px-20;
          }
          .message-icon {
            @apply pb-6 text-center;
            &__style {
              @apply inline rounded-full  p-1 text-4xl text-white;
            }
            .icon-error {
              @apply bg-error;
            }
            .icon-success {
              @apply bg-success;
            }
          }
          .message-text {
            @apply text-lg font-bold;
          }
          .message-btn {
            @apply btn-primary btn-sm btn rounded-full text-white my-8 px-8;
          }
          
        }
      }
    }
  }
}

</style>