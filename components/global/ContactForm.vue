<template>
  <section class="component-section">
    <div class="component-section__container ">
      <div class="outer-wrapper ">
        <slot name="head">
          <div class="outer-wrapper__text">
            <span class="section-title t">{{$t('contact.title')}}</span>
            <h2 class="section-message ">{{$t('contact.message')}}</h2>
          </div>
        </slot>
        <div>
          <form v-if="lead" @submit="save">
            <slot name="body">
              <div class="form-fieldset-full">
                <div class="form-fieldset-full__field">
                  <label class="">
                    <span class="label-text">{{$t('contact.subject')}}</span>
                    <span class="text-error">*</span>
                  </label>
                  <select class="" v-model="lead.name" required > 
                    <option :value="$t('contact.first_option')">{{$t('contact.first_option')}} </option>
                    <option :value="$t('contact.second_option')">{{$t('contact.second_option')}}</option>
                  </select>
                </div>
              </div>
              <div class="form-fieldset ">
                <div class="form-fieldset__field ">
                  <label class="label">
                    <span class="label-text">{{$t('account.address.name')}}</span>
                    <span class="text-error">*</span>
                  </label>
                  <input type="text" class="form-fieldset__input" :placeholder="$t('account.address.name')"  v-model="lead.contact_name" required/>
                </div>
                <div class="form-fieldset__field ">
                  <label class="label">
                    <span class="label-text">{{$t('account.address.email')}}</span>
                    <span class="text-error">*</span>
                  </label>
                  <input type="email" class=" form-fieldset__input"  placeholder="name@example.com"  v-model="lead.email" required />
                </div>
              </div>
              <div class=" form-fieldset ">
                <div class="form-fieldset__field  ">
                  <label class="label">
                    <span class="label-text">{{$t('account.address.phone')}}</span>
                    <span class="text-error">*</span>
                  </label>
                  <input type="text" class="  form-fieldset__input" v-model="lead.phone" :placeholder="$t('account.address.phone')" required/>
                </div>
                <div class="form-fieldset__field ">
                  <label class="label">
                    <span class="label-text">{{$t('account.address.street')}}</span>
                  </label>
                  <input type="text" class=" form-fieldset__input"  v-model="lead.street" :placeholder="$t('account.address.street')" required />
                </div>
              </div>
              <div class="form-fieldset ">
                <div class="form-fieldset__field ">
                  <label class="label">
                    <span class="label-text">{{$t('account.address.city')}}</span>
                  </label>
                  <input type="text" class="  form-fieldset__input" v-model="lead.city" :placeholder="$t('account.address.city')" required />
                </div>
                <div class="form-fieldset__field ">
                  <label class="label">
                    <span class="label-text">{{$t('account.address.zip')}}</span>
                  </label>
                  <input type="text" class=" form-fieldset__input" v-model="lead.zip" :placeholder="$t('account.address.zip')" required />
                </div>
              </div>
              <div class="form-fieldset ">
                <div class="form-fieldset__messagearea">
                  <label class="label">
                    <span class="label-text">{{$t('contact.description')}}</span>
                    <span class="text-error">*</span>
                  </label>
                  <textarea class="textarea " v-model="lead.description" :placeholder="$t('contact.description')" required></textarea>
                </div>
                
               </div>
            </slot>
            <slot name="action">
              <div class="form-fieldset-last ">
                <label>
                  <input  type="checkbox" name="terms" value="1" required>
                  <span >{{$t('contact.data_protection')}}</span> 
                  <nuxt-link :to="localePath(dataPolicyPage )">
                    <span class="pointer">{{$t('contact.data_policy')}}</span>
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
      @apply max-w-3xl mx-auto text-center;
      &__text {
        @apply max-w-md mb-8 mx-auto;
        .section-title{
          @apply text-sm text-gray-700;
        }
        .section-message {
          @apply mt-2 text-4xl font-bold font-heading;
        }
      }
      .form-fieldset-full{
        &__field {
          @apply form-control w-full flex justify-center;
         label {
          @apply label justify-start;
         }
         select {
          @apply  select bg-gray-100 rounded outline-none mr-2; 
          
         }
        }
      }
      .form-fieldset {
        @apply mb-4 flex justify-center form-control w-full flex-col md:flex-row;
        .form-fieldset__field  {
          @apply flex flex-col w-full md:w-1/2;
        }
        textarea {  
          @apply w-full h-24 p-4 text-xs font-semibold leading-none resize-none bg-gray-50 rounded outline-none;
        }
        &__input {
          @apply  input p-4 text-xs font-semibold leading-none bg-gray-100 rounded outline-none mr-2;
        }
        &__select {
          @apply text-gray-400 select w-full md:w-1/2 p-4 text-xs font-semibold leading-none bg-gray-100 rounded outline-none mr-2;
        }
        &__messagearea {
          @apply w-full;
          
          label {
            @apply justify-start;
          }
        }
      }
      .form-fieldset-last{
        @apply flex justify-between items-center;
        label {
          input {
            @apply mr-1;
          }
          span {
            @apply text-sm font-semibold text-primary;
          }
        }
        &__submit {
          @apply  py-4 px-8 text-sm text-white font-semibold leading-none bg-primary hover:bg-blue-900 rounded;
        }
      }
    }
  }
}
</style>