import { set } from 'lodash'
import { defineStore } from 'pinia'
export interface NotificationMessage {
  message: string
  title?: string
  type: 'success' | 'error' | 'info' | 'warning'
}
const notification = defineStore('notification', {
  state: () => ({
    messages: [] as NotificationMessage[]
  }),
  actions: {
    addMessage(message: string, title?: string) {
      this.messages.push({
        message,
        type: 'success',
        title
      })
      const index = this.messages.length - 1
      setTimeout(() => {
        this.messages.splice(index, 1)
      }, 5000)
    },
    addError(message: string, title?: string) {
      this.messages.push({
        message,
        type: 'error',
        title
      })
    }
  }
})
export const useNotification = () => {
  return notification()
}
