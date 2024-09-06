import { defineStore } from 'pinia'
export interface NotificationMessage {
  message: string
  title?: string
  type: 'success' | 'error' | 'info' | 'warning'
}
// store for notification messages
const notification = defineStore('notification', {
  state: () => ({
    messages: [] as NotificationMessage[]
  }),

  actions: {
    addMessage(message: string, title?: string, duration?: number) {
      this.addNotification('success', message, title, duration)
    },
    addWarning(message: string, title?: string, duration?: number) {
      this.addNotification('warning', message, title, duration)
    },
    addError(message: string, title?: string, duration?: number) {
      this.addNotification('error', message, title, duration)
    },
    addNotification(
      type: 'error' | 'warning' | 'success',
      message: string,
      title?: string,
      duration?: number
    ) {
      const appConfig = useAppConfig()
      const nDuration = duration ? duration : appConfig?.notifications?.duration || 5000
      this.messages.push({
        message,
        type: type,
        title
      })
      const index = this.messages.length - 1
      setTimeout(() => {
        this.messages.splice(index, 1)
      }, nDuration)
    }
  }
})
export const useNotification = () => {
  return notification()
}
