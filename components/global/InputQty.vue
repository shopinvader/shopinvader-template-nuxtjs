<template>
  <div>
    <div class="input-qty">
      <!--
  	@slot Selector
		@binding {number} qty quantity of the cart line
		@binding {string} onChange callback function to fire quantity change save
	  -->
      <slot name="selector" v-bind="{ value }" :on-change="inputValue">
        <button class="input-qty__btn min" @click="decrQuantity()">
          <icon name="minus" />
        </button>
        <input
          ref="input"
          v-model.number="value"
          type="number"
          class="input-qty__input"
          @click="selectContent"
          @keydown="keydown"
          @keypress="isNumber($event)"
        />
        <button class="input-qty__btn max" @click="incrQuantity()">
          <icon name="plus" />
        </button>
      </slot>
    </div>
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
  @apply input input-bordered flex items-center gap-2;
  &__input {
    @apply grow text-center;
    appearance: textfield;
  }
  &__btn {
    @apply flex h-full cursor-pointer items-center hover:text-primary-500;
  }
}
</style>
