<template>
  <section class="component-section ">
    <div class="component-section__container ">
      <div class="outer-wrapper ">
        <slot name="head">
          <div class="outer-wrapper__text">
            <span class="text-sm text-gray-700">{{$t('contact.title')}}</span>
            <h2 class="mt-2 text-4xl font-bold font-heading">{{$t('contact.message')}}</h2>
          </div>
        </slot>
        <div>
          <form v-if="lead" @submit="save">
            <slot name="body">
              <div class="form-fieldset">
                <select v-model="lead.name" class="form-fieldset__select" required>
                  <option  selected > {{$t('contact.subject')}} </option>
                  <option :value="$t('contact.first_option')">{{$t('contact.first_option')}} </option>
                  <option :vlaue="$t('contact.second_option')">{{$t('contact.second_option')}}</option>
                </select>
                
              </div>
              <div class="form-fieldset ">
                <input class="form-fieldset__input " type="text" :placeholder="$t('contact.contact_name')"  v-model="lead.contact_name" required>
                <input class="form-fieldset__input" type="email" placeholder="name@example.com"  v-model="lead.email" required>
              </div>
              <div class="form-fieldset">
                <input class="form-fieldset__input " type="text" v-model="lead.phone" :placeholder="$t('contact.phone')" required>
                <input class="form-fieldset__input " type="text" v-model="lead.street" :placeholder="$t('contact.street')" required>
              </div>
              <div class="form-fieldset ">
                <input class="form-fieldset__input" type="text" v-model="lead.zip" :placeholder="$t('contact.zip')" required>
                <input class="form-fieldset__input" type="text" v-model="lead.city" :placeholder="$t('contact.city')" required>
              </div>
              <div class="form-fieldset ">
                <textarea class="" type="text" v-model="lead.description" :placeholder="$t('contact.description')" required></textarea>
              </div>
            </slot>
            <slot name="action">
              <div class="form-fieldset-last ">
                <label>
                  <input class="mr-1" type="checkbox" name="terms" value="1" required>
                  <span class="text-sm font-semibold">{{$t('contact.data_protection')}}</span> 
                  <nuxt-link :to="localePath(dataPolicyPage )">
                    <span class="text-sm font-semibold text-primary">{{$t('contact.data_policy')}}</span>
                  </nuxt-link>
                 
                </label>
                <button class="form-fieldset-last__submit" type="submit">{{$t('contact.send')}}</button>
              </div>
            </slot>
          </form>
        </div>
      </div>
    </div>
</section>
</template>
<script lang="ts">
import { Lead } from '~/models/Lead'
export default defineNuxtComponent({
  name: 'ContactForm',
  setup() {
    const settings = useShopinvaderService('settings')?.init()
    const countries = settings?.countries || []
    return {
      countries
    }
  },
  data() {
    return {
      lead: new Lead({}),
      countries: [],
      submitted: false,
    }
  },
  props: {
   dataPolicyPage :{
      required: false,
      type: String,
      default: ''
    },
  },
  methods: {
    save(e: Event) {
      e.preventDefault()
      this.submitted = true
      let lead = this.lead
      this.$emit('lead',lead)
    }
  },
})
</script>
<style lang="scss">
.component-section {
  @apply py-20;
  &__container {
    @apply container px-4 mx-auto;
    .outer-wrapper {
      @apply max-w-2xl mx-auto text-center;
      &__text {
        @apply max-w-md mb-8 mx-auto;
      }
      .form-fieldset {
        @apply mb-4 flex justify-center;
        textarea {  
          @apply w-full h-24 p-4 text-xs font-semibold leading-none resize-none bg-gray-50 rounded outline-none;
        }
        &__input {
          @apply w-1/2 p-4 text-xs font-semibold leading-none bg-gray-100 rounded outline-none mr-2;
        }
        &__select {
          @apply text-gray-400 select w-1/2 p-4 text-xs font-semibold leading-none bg-gray-100 rounded outline-none mr-2;
        }
      }
      .form-fieldset-last{
        @apply flex justify-between items-center;
        &__submit {
          @apply  py-4 px-8 text-sm text-white font-semibold leading-none bg-primary hover:bg-blue-900 rounded;
        }
      }
    }
  }
}
</style>