<template>
  <Teleport to="#header-target">
    <dialog ref="message" class="modal-popup" :class="classContent">
        <div class="modal-box">
          <form method="dialog">
            <button  @click="$emit('close')" class="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">✕</button>
          </form>
          <slot name="content">
          </slot>
        </div>
    </dialog>
  </Teleport>
</template>
<script setup lang="ts">
const message = ref<HTMLElement | null>(null);
const props = defineProps({
  opened: {
    type: Boolean,
    default: false,
    required: true,
  },
  classContent: {
    type: String,
    default: ''
  },
})
watch( () => props.opened, (opened) => {
  if(document?.body) {
    if (opened && message?.value) {
      message?.value?.showModal()
    } else {
      message?.value?.close()
    }
  }
}, { immediate: true });  

onMounted(() => {
  if(document?.body) {
      if (props.opened) {
            message?.value.showModal()
          } else {
            message?.value.close()
          }
    }
})
const emit = defineEmits(['close', 'submit'])
const submit= () =>  { 
     emit('close')
}
   const onClose = () => {
     emit('close')
   }
</script>

<style lang="scss">
.modal-popup {
  @apply modal;
}
</style>
