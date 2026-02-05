// ~/directives/merge-class.ts
import { defineNuxtDirective } from 'nuxt/app';
import { twMerge } from 'tailwind-merge';

export default defineNuxtDirective({
  mounted(el, binding) {
    // Fusionne les classes existantes avec celles passées en binding
    const existingClasses = el.getAttribute('class') || '';
    const mergedClasses = twMerge(existingClasses, binding.value);
    el.setAttribute('class', mergedClasses);
  },
  updated(el, binding) {
    // Mise à jour si la valeur change
    const existingClasses = el.getAttribute('class') || '';
    const mergedClasses = twMerge(existingClasses, binding.value);
    el.setAttribute('class', mergedClasses);
  },
  getSSRProps(binding) {
    // Pour le SSR, retourne les classes fusionnées
    return {
      class: binding.value
    };
  }
});
