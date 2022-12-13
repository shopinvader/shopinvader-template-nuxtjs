<template>
<div class="cart-line-qty">
  <div class="input-group">
    <div class="cartline-qty__btn min" @click="decrQuantity()">
      -
    </div>
    <input
      ref="input"
      v-model.number="qty"
      type="number"
      class="cartline-qty__input"
      @change="inputValue"
      @click="selectContent"
      @keydown="keydown"
      @keypress="isNumber($event)"
    >
    <div class="cartline-qty__btn max" @click="incrQuantity()">
      +
    </div>
  </div>
</div>
</template>
<script lang="ts">
import { PropType } from 'vue'
import { CartLine } from '~/models'

export default {
name: 'CartLineQty',
props: {
  line: {
    required: true,
    type: Object as PropType<CartLine>
  }
},
data () {
  const timer: any = null
  const qty:number = 0

  return {
    disabledArrow: false as boolean,
    qty,
    timer
  }
},
watch: {
  line (line:CartLine| null, oldLine:CartLine | null) {
    if (line !== null) {
      this.qty = line.qty
    } else if (oldLine !== null && line == null) {
      this.qty = 0
    }
  }
},
mounted () {
  if (this.line !== null) {
    this.qty = this.line.qty
  }
},
methods: {
  selectContent () {
    const ref = this?.$refs?.input as any
    if (ref.select !== undefined) {
      ref.select()
    }
  },
  isNumber (evt: any) {
    const charCode = (evt.which) ? evt.which : evt.keyCode
    if (charCode < 48 || charCode > 57) {
      evt.preventDefault()
    } else {
      return true
    }
  },
  keydown (event:any):void {
    if (event?.key === 'Enter' || event?.key === 'Escape') {
      const ref = this?.$refs?.input as any
      if (ref.select !== undefined) {
        ref.blur()
      }
    }
  },
  incrQuantity (): void {
    this.applyDeltaOnItem(1)
  },
  decrQuantity (): void {
    if (this.qty > 0) {
      this.applyDeltaOnItem(-1)
    }
  },
  changeQuantity (): void {
    if (!isNaN(this.qty)) { //  && !this.disabledArrow
      if (this.qty < 0) {
        this.qty = 1
      }
      this.updateItem(this.qty)
    }
  },
  async applyDeltaOnItem (delta:number):void {
    const cartService = useShopinvaderServices()?.cart
    if(cartService !== null) {
      await cartService.applyDeltaOnItem(this.line.productId, delta)
    }
  },
  async updateItem (value:number):void {
    const cartService = useShopinvaderServices()?.cart
    if(cartService !== null) {
      await cartService.updateItem(this.line.productId, value, this.line)

    }
  },
  inputValue (): void {
    this.changeQuantity()
  }
}
}
</script>
<style lang="scss">
.cartline-qty {
  @apply form-control w-6 max-w-fit mx-3;
  &__btn {
    @apply btn btn-outline text-3xl;
    &.min {
      @apply border-r-0;
    }
    &.max {
      @apply border-l-0;
    }
  }
  &__input {
    @apply input border border-x-0 border-gray-900 text-center; 
  }  
}
</style>