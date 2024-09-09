import { defineNuxtPlugin } from '#app'
import mediumZoom, { type Zoom } from 'medium-zoom'

export default defineNuxtPlugin((nuxtApp) => {
  const selector = '.image-zoom'
  const zoom: Zoom = mediumZoom(selector, { background: '#0f0f0f87' })

  // (re-)init for newly rendered page, also to work in SPA mode (client-side routing)
  nuxtApp.hook('page:finish', () => {
    zoom.detach(selector).attach(selector)
  })

  // make available as helper to NuxtApp
  nuxtApp.provide('mediumZoom', zoom)
})
