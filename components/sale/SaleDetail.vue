<template>
  <div class="sale" v-if="sale">
    <div class="sale__header">
      <slot name="header" :sale="sale">
        <div class="header__number" v-if="sale.name">
          <div class="label">
            {{ $t('sale.name') }}
          </div>
          <div class="value">
            {{ sale.name }}
          </div>
        </div>
        <div class="header__date" v-if="sale.date">
          <div class="label">
            {{ $t('sale.date') }}
          </div>
          <div class="value">
            {{ sale.date.toLocaleDateString($i18n.locale) }}
          </div>
        </div>
        <div class="header__content">
          <slot name="content" :sale="sale"></slot>
        </div>
        <div v-if="sale.customerRef" class="header__customerRef">
          <slot name="customerRef" :sale="sale">
            <div class="label">
              {{ $t('sale.customerRef') }}
            </div>
            <div class="value">
              {{ sale.customerRef }}
            </div>
          </slot>
        </div>
        <div class="header__action">
          <slot name="action" :sale="sale"></slot>
        </div>
        <div class="header__state">
          <slot name="state" :sale="sale">
            <div v-if="sale.stateLabel" class="state" :class="`state--${sale.state}`" >
              {{ sale.stateLabel }}
            </div>
          </slot>
        </div>
      </slot>
      <div class="header__progess">
        <slot name="progress" :sale="sale">
          <progress class="progress progress-primary" :value="sale.stateProgress" max="100"></progress>
        </slot>
      </div>
    </div>
    <div class="sale__addresses">
      <slot name="delivery" :sale="sale">
        <address-card v-if="sale?.delivery?.address" :address="sale.delivery.address">
          <template #header :address="sale?.delivery?.address">
            {{$t('sale.delivery.address')}}
            <span class="mx-1">{{ sale?.delivery?.address?.name }}</span>
          </template>
        </address-card>
      </slot>
      <slot name="invoice" :sale="sale">
        <address-card  v-if="sale?.invoicing?.address" :address="sale.invoicing.address">
          <template #header :address="sale?.invoicing?.address">
            {{$t('sale.invoicing.address')}}
            <span class="mx-1">{{ sale?.invoicing?.address?.name }}</span>
          </template>
        </address-card>
      </slot>
    </div>
    <div class="sale__lines">
      <slot name="lines" :sale="sale">
        <div v-if="sale.lines" class="lines">
          <sale-line
            v-for="line in sale.lines"
            :key="line.id"
            :line="line"
          >
          </sale-line>
        </div>
      </slot>
    </div>
    <div class="sale__footer">
      <div class="footer__note">
        <slot name="note" :sale="sale">
          <div v-if="sale.note" class="note">
            <div class="label">
              {{ $t('sale.note') }}
            </div>
            <div class="value">
              {{ sale.note }}
            </div>
          </div>
        </slot>
      </div>
      <div class="footer__total">
        <slot name="total" :sale="sale">
          <div class="mb-10">
            <div class="total__item">
              <span class="font-medium">
                {{ $t('sale.amount.untaxed') }}
              </span>
              <span class="font-bold font-heading">
                {{ $filter.currency(sale?.amount?.untaxed || 0) }}
              </span>
            </div>
            <div class="total__item">
              <span class="font-medium">
                {{ $t('sale.amount.tax') }}
              </span>
              <span class="font-bold font-heading">
                {{ $filter.currency(sale?.amount?.tax || 0) }}
              </span>
            </div>
            <div class="total__item">
              <span class="font-medium">
                {{ $t('sale.amount.total') }}
              </span>
              <span class="font-bold font-heading">
                {{ $filter.currency(sale?.amount?.total || 0) }}
              </span>
            </div>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts" >
  import type { Sale } from '#models';
  const props = defineProps({
    sale: {
      type: Object as PropType<Sale>,
      required: true
    }
  })
</script>
<style lang="scss">
  .sale {
    @apply border p-4;
    &__header {
      @apply flex flex-wrap flex-row gap-5  py-5;
      .header {
        &__number, &__date, &__customerRef {
          @apply text-left;
          .label {
            @apply text-gray-700 p-0;
          }
          .value {
            @apply font-bold;
          }
        }
        &__action {
          @apply flex-grow text-right ;
        }
        &__state {
          .value {
            @apply font-bold;
          }
        }
        &__progess {
          @apply w-full flex-grow;
        }
      }
    }
    &__addresses {
      @apply flex flex-row flex-wrap justify-center md:justify-start gap-4;
      .address-card {
        @apply p-4 bg-base-100 rounded w-full md:w-auto;
        .header {
          &__title {
            @apply text-lg;
          }

        }
        &__content {
          @apply text-sm ml-0 ;
        }
      }
    }
    &__lines {
      @apply py-4;
      .lines {
        @apply flex flex-col gap-2 w-full;
      }
    }
    &__footer {
      @apply flex justify-between;

      .footer {
        &__note {
          @apply  md:w-1/2;
        }
        &__total {
          @apply w-full md:w-1/2 flex flex-col gap-2 mb-10;
          .total {
            &__item {
              @apply flex justify-between py-3 px-10 odd:bg-gray-100 rounded-full;

            }
          }
        }
      }
    }
  }
</style>
