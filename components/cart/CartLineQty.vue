<template>
  <div class="cart-line-qty">
    <!--
  	@slot Selector
		@binding {number} qty quantity of the cart line
		@binding {string} onChange callback function to fire quantity change save
	  -->
    <slot name="selector" v-bind="{ qty }" :onChange="inputValue">
      <div class="input-group">
        <div class="cartline-qty__btn min" @click="decrQuantity()">-</div>
        <input
          ref="input"
          v-model.number="qty"
          type="number"
          class="cartline-qty__input"
          @change="inputValue"
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
import { PropType } from 'vue'
import { CartLine } from '~/models'
/**
 * Display a selector to update the quantity of a cart's line.
 * This component is used in the component CartLine.
 */
export default {
  name: 'CartLineQty',
  props: {
    /**  Cart's line */
    line: {
      required: true,
      type: Object as PropType<CartLine>
    }
  },
  emits: {
    /**  Emit when the quantity is updated */
    update: (qty: number) => true
  },
  data() {
    const timer: any = null
    const qty = 0

    return {
      disabledArrow: false as boolean,
      qty,
      timer
    }
  },
  watch: {
    line(line: CartLine | null, oldLine: CartLine | null) {
      if (line !== null) {
        this.qty = line.qty
      } else if (oldLine !== null && line == null) {
        this.qty = 0
      }
    }
  },
  mounted() {
    if (this.line !== null) {
      this.qty = this.line.qty
    }
  },
  methods: {
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
      this.applyDeltaOnItem(1)
    },
    decrQuantity(): void {
      if (this.qty > 0) {
        this.applyDeltaOnItem(-1)
      }
    },
    changeQuantity(): void {
      if (!isNaN(this.qty)) {
        if (this.qty < 0) {
          this.qty = 1
        }
        this.updateItem(this.qty)
      }
    },
    async applyDeltaOnItem(delta: number): Promise<void> {
      const cartService = useShopinvaderService('cart')
      if (cartService && this.line?.productId) {
        await cartService.applyDeltaOnItem(this.line.productId, delta)
      }
      this.$emit('update', this.qty + delta)
    },
    async updateItem(value: number): Promise<void> {
      const cartService = useShopinvaderService('cart')
      if (cartService && this.line?.productId) {
        await cartService.updateItem(this.line.productId, value, this.line)
      }
      this.$emit('update', value)
    },
    inputValue(): void {
      this.changeQuantity()
    }
  }
}
</script>
<style lang="scss">
.cart-line-qty {
  @apply w-52 rounded-full border-2 border-primary;
  .cartline-qty {
    @apply form-control mx-3 w-10 max-w-fit;
    &__btn {
      @apply btn-circle btn border-4 border-transparent bg-inherit text-3xl text-primary;
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