<template>
  <button class="btnCmp" :disabled="disabled" :class="style" @click="click">
    <slot></slot>
  </button>
</template>
<script lang="ts">

export default defineNuxtComponent({
  emits: ["click"],
  props: {
    disabled: {
      required: false,
      default: false,
      type: Boolean,
    },
    size: {
      type: String,
      default: "normal",
    },
    color: {
      type: String,
      default: "primary",
    },
    outline: {
      type: Boolean,
      default: false,
    },
    colorLevel: {
      required: false,
      default: 500,
      type: Number,
    },
    gradient: {
      required: false,
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const style: any = computed(() => {
      const colorBase = props.colorLevel;
      const color1 = props.color + "-" + colorBase;
      const color2 = props.color + "-" + (colorBase + 100);
      let colorStyle = `btn text-white font-bold hover:bg-${color1} hover:text-gray-50 `;
      let size = "px-6 py-2";
      if (props.size === "small") {
        size = " px-4 py-1";
      }
      if (props.size === "extra-small") {
        size = " px-1 py-1";
      }
      if (!props.outline) {
        if (props.gradient) {
          colorStyle += `bg-gradient-to-r from-${color1} to-${color2} text-gray-50`;
        } else {
          colorStyle += `bg-${color1}`;
        }
      } else {
        colorStyle += `border border-${color1} text-${color2}`;
      }
      return `${size} ${colorStyle}`;
    })

    function click() {
        this.$emit("click");
    }

    return {
      style,
      click
    }
  }
});
</script>
<style lang="scss">
.btnCmp {
  @apply rounded text-center transition-colors hover:shadow-lg;
}
</style>
