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
        <div class="header__state">
          <slot name="state" :sale="sale">
            <div class="label">
              {{ $t('sale.state') }}
            </div>
            <sale-status :sale="sale" />
          </slot>
        </div>
        <div class="header__action">
          <slot name="action" :sale="sale"></slot>
        </div>
      </slot>
      <div class="header__info">
        <slot name="info" :sale="sale"></slot>
      </div>
      <div class="header__progess">
        <slot name="progress" :sale="sale">
          <progress
            class="progress progress-success"
            :value="sale.stateProgress"
            max="100"
          ></progress>
        </slot>
      </div>
    </div>
    <div class="sale__addresses">
      <slot name="delivery" :sale="sale">
        <address-card v-if="sale?.delivery?.address" :address="sale.delivery.address">
          <template #header :address="sale?.delivery?.address">
            <div>
              <icon name="location" />
              {{ $t('sale.delivery.address') }}
            </div>
            <div class="">{{ sale?.delivery?.address?.name }}</div>
          </template>
        </address-card>
      </slot>
      <slot name="invoice" :sale="sale">
        <address-card v-if="sale?.invoicing?.address" :address="sale.invoicing.address">
          <template #header :address="sale?.invoicing?.address">
            <div>
              <icon name="billing"></icon>
              {{ $t('sale.invoicing.address') }}
            </div>
            <div class="">{{ sale?.invoicing?.address?.name }}</div>
          </template>
        </address-card>
      </slot>
    </div>
    <div class="sale__lines">
      <slot name="lines" :sale="sale">
        <div v-if="sale.lines" class="lines">
          <sale-line v-for="line in sale.lines" :key="line.id" :line="line"> </sale-line>
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
            <div v-if="sale?.amount?.discountTotal !== 0" class="total__item">
              <span class="font-medium">
                {{ $t('sale.amount.discount') }}
              </span>
              <span class="font-heading font-bold">
                - {{ $filter.currency(sale?.amount?.discountTotal || 0) }}
              </span>
            </div>
            <div class="total__item">
              <span class="font-medium">
                {{ $t('sale.amount.untaxed') }}
              </span>
              <span class="font-heading font-bold">
                {{ $filter.currency(sale?.amount?.untaxed || 0) }}
              </span>
            </div>
            <div class="total__item">
              <span class="font-medium">
                {{ $t('sale.amount.tax') }}
              </span>
              <span class="font-heading font-bold">
                {{ $filter.currency(sale?.amount?.tax || 0) }}
              </span>
            </div>
            <div class="total__item">
              <span class="font-medium">
                {{ $t('sale.amount.total') }}
              </span>
              <span class="font-heading font-bold">
                {{ $filter.currency(sale?.amount?.total || 0) }}
              </span>
            </div>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Sale } from '#models'
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
    @apply flex flex-row flex-wrap gap-5  py-5;
    .header {
      &__number,
      &__date,
      &__customerRef,
      &__state {
        @apply text-left;
        .label {
          @apply p-0 text-gray-700;
        }
        .value {
          @apply font-bold;
        }
      }
      &__action {
        @apply flex-grow text-right;
      }
      &__state {
        .value {
          @apply font-bold;
        }
      }
      &__progess {
        @apply w-full flex-grow;
      }
      &__info {
        @apply w-full flex-grow;
      }
    }
  }
  &__addresses {
    @apply flex flex-row flex-wrap justify-center gap-4 md:justify-start;
    .address-card {
      @apply w-full rounded bg-base-100 p-4 md:w-auto lg:w-5/12 xl:w-1/3;
      .header {
        &__title {
          @apply text-lg;
        }
      }
      &__content {
        @apply ml-0 pl-1 text-sm;
      }
    }
  }
  &__lines {
    @apply py-4;
    .lines {
      @apply flex w-full flex-col gap-2;
    }
  }
  &__footer {
    @apply flex justify-between;

    .footer {
      &__note {
        @apply md:w-1/2;
      }
      &__total {
        @apply mb-10 flex w-full flex-col gap-2 md:w-1/2;
        .total {
          &__item {
            @apply flex justify-between rounded-full px-10 py-3 odd:bg-gray-100;
          }
        }
      }
    }
  }
}
</style>
