<template>
  <slot name="contact-thankyou">
        <div v-if="thankyouMessage" class="message">
          <div class="message__container">
            <div class="icon-wrapper">
              <icon icon="ic:outline-email" class="icon-wrapper__icon"> </icon>
            </div>
            <div class="text-content">
              {{ $t('contact.form_sent.thankyou_title') }}
              <div>
              {{ $t('contact.form_sent.thankyou_description') }}
              </div>  
            </div>
            <a href="/" class="btn-outline btn-primary btn-wide btn">
                {{ $t('btn.back') }}
              </a>
          </div>
        </div>
      </slot> 
  <slot name="loading">
    <div v-if="showLoader && !thankyouMessage" class="loading">
      <spinner></spinner>
    </div>
  </slot>
  <contact-form v-if="!thankyouMessage && !showLoader" @lead="sendLead" dataPolicyPage="/data-protection"></contact-form>
</template>
<script lang="ts">
import { Lead } from '~/models/Lead'
import ContactForm  from "~/components/global/ContactForm.vue";

export default defineNuxtComponent({
  components: {
    'contact-form': ContactForm
  },
  data(){
    return {
      thankyouMessage: false,
      showLoader: false
    }
  },
  methods: {
    async sendLead(lead: Lead) {
      const leadsService = useShopinvaderService('leads')
      const notifications = useNotification()
      if (leadsService && lead) {
        try {
          if (lead) {
            this.showLoader = true
            await leadsService.create(lead)
          }
          notifications.addMessage(
            this.$t('contact.form.message_sent')
          )
          
          this.thankyouMessage = true 
        } catch (e) {
          console.error(e)
          notifications.addError(this.$t('contact.error'))
        }
      }
      this.showLoader = false
    },
  }
})
</script>
<style lang="scss">
.message {
  @apply my-8 flex flex-wrap md:items-center;

  &__container {
    @apply w-full rounded-3xl bg-gray-100 px-8 py-20 text-center lg:px-20;
    .icon-wrapper {
      @apply pb-6 text-center;

      &__icon {
        @apply inline rounded-full bg-success p-1 text-4xl text-white;
      }
    }
    .text-content {
      @apply text-lg font-bold mb-8;
    } 
  }
}
.loading {
  @apply w-full py-24 flex justify-center align-middle items-center h-full;
}
</style>