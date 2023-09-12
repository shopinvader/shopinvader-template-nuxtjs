import { createDefu } from 'defu'

export const configMerge = createDefu((obj, key, value) => {
  if (key === 'indices') {
    obj[key] = value
    return true
  }
})
