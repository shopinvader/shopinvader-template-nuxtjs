// Create a directive to animate elements
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('animate', {
    mounted(el, binding) {
      const { value } = binding
      const { animations } = useAppConfig() as any
      if (!animations) return false
      let motion = animations?.[value.name] || false
      if (typeof motion === 'function') {
        motion = motion(value.index)
      }
      useMotion(el, motion)
    },
    getSSRProps(binding, vnode) {
      // you can provide SSR-specific props here
      return {}
    }
  })
})
