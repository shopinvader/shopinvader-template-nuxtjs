<template>
  <div class="input-qty">
    <!--
  	@slot Selector
		@binding {number} qty quantity of the cart line
		@binding {string} onChange callback function to fire quantity change save
	  -->
    <slot name="selector" v-bind="{ value }" :on-change="inputValue">
      <div class="input-group">
        <div class="cartline-qty__btn min" @click="decrQuantity()">-</div>
        <input
          ref="input"
          v-model.number="value"
          type="number"
          class="cartline-qty__input"
          @click="selectContent"
          @keydown="keydown"
          @keypress="isNumber($event)"
        />
        <div class="cartline-qty__btn max" @click="incrQuantity()">+</div>
      </div>
    </slot>
  </div>
</template>
<script lang="ts">
/**
 * Display a selector to update the quantity of a cart's line.
 * This component is used in the component CartLine.
 */
export default {
  props: {
    /**  Value */
    qty: {
      required: false,
      type: Number,
      default: 1
    }
  },
  emits: {
    /**  Emit when the quantity is updated */
    change: (_qty: number) => true
  },
  data() {
    const timer: any = null
    const value = this.qty || 1

    return {
      disabledArrow: false as boolean,
      value,
      timer
    }
  },
  watch: {
    qty(qty: number | null, oldQty: number | null) {
      if (qty !== null) {
        this.value = qty
      } else if (oldQty !== null && qty == null) {
        this.value = 0
      }
    },
    value(value: number, oldValue: number) {
      if (value !== oldValue) {
        this.$emit('change', value)
      }
    }
  },
  mounted() {
    if (this.qty !== null) {
      this.value = this.qty
    }
  },
  methods: {
    inputValue(value: number) {
      this.value = value
    },
    selectContent() {
      const ref = this?.$refs?.input as any
      if (ref.select !== undefined) {
        ref.select()
      }
    },
    isNumber(evt: any) {
      const charCode = evt.which ? evt.which : evt.keyCode
      if (charCode < 48 || charCode > 57) {
        evt.preventDefault()
      } else {
        return true
      }
    },
    keydown(event: any): void {
      if (event?.key === 'Enter' || event?.key === 'Escape') {
        const ref = this?.$refs?.input as any
        if (ref.select !== undefined) {
          ref.blur()
        }
      }
    },
    incrQuantity(): void {
      this.value++
    },
    decrQuantity(): void {
      if (this.value > 0) {
        this.value -= 1
      } else {
        this.value = 0
      }
    }
  }
}
</script>
<style lang="scss">
.input-qty {
  @apply w-52 rounded-full border-2 border-primary;
  .cartline-qty {
    @apply form-control mx-3 w-10 max-w-fit;
    &__btn {
      @apply btn btn-circle border-4 border-transparent bg-inherit text-3xl text-primary;
      &.max {
        @apply text-4xl;
      }
      &.min {
        @apply text-xl;
      }
      &:hover {
        @apply border-primary bg-secondary;
      }
    }
    &__input {
      @apply input w-full border-0 bg-inherit text-center text-lg font-bold text-primary;
      appearance: textfield;
    }
  }
}
</style>
