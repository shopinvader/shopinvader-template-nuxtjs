<template>
  <div class="cart-line-qty">
    <!--
  	@slot Selector
		@binding {number} qty quantity of the cart line
		@binding {string} onChange callback function to fire quantity change save
	  -->
    <slot name="selector" v-bind="{ qty }" :on-change="updateQty">
      <input-qty v-if="qty" :qty="qty" @change="updateQty"></input-qty>
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
      required: false,
      type: Object as PropType<CartLine>,
      default: () => null
    }
  },
  emits: {
    /**  Emit when the quantity is updated */
    update: (qty: number) => true
  },
  setup(props) {
    const qty = ref(props.line?.qty || null) as Ref<number | null>
    const disabledArrow = ref(false) as Ref<boolean>
    const timer = ref(null) as Ref<any>
    return {
      qty,
      disabledArrow,
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

    async updateQty(qty: number): Promise<void> {
      const delta = qty - this.qty || 0
      const cartService = useShopinvaderService('cart')
      if (cartService && this.line?.productId && delta !== 0) {
        const options = this.line?.options || null
        await cartService.applyDeltaOnItem(this.line.productId, delta, options)
      }
      this.$emit('update', this.qty + delta)
    }
  }
}
</script>
<style lang="scss">
</style>
