<template>
  <div class="form-control">
    <label class="input-group input-group-xs">
      <button class="btn btn-square" @click="down()">-</button>
      <input type="text" placeholder="1" @keydown="keyDown" :value="value" class="input input-bordered" />
      <button class="btn btn-square"  @click="up()">+</button>
    </label>
  </div>
</template>
<script lang="ts">
export default {
  name: 'ProductQty',
  props : {
    quantity: {
      type: Number,
      default: 1
    }
  },
  setup(props) {
    const value = ref(props?.quantity || 1)
    return {
      value
    }
  },
  methods: {
    up() {
      this.value++;
    },
    down() {
      if (this.value > 0) {
        this.value--;
      } else {
        this.value = 0;
      }
    },
    keyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowUp') {
        this.up();
      } else if (e.key === 'ArrowDown') {
        this.down();
      } else if (e.key === 'Enter') {
        this.$emit('enter', this.value);
      } else if (e.key !== 'Backspace' && isNaN(parseInt(e.key))) {
        e.preventDefault();
      }
    },
  }
}
</script>