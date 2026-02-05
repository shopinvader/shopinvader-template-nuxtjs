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
      const newMessage: NotificationMessage = {
        message,
        type: type,
        title
      }
      // Add the message to the list to be displayed
      this.messages.push(newMessage)
      setTimeout(() => {
        // Remove the message after the duration
        this.messages.splice(this.messages.indexOf(newMessage), 1)
      }, nDuration)
    }
  }
})
export const useNotification = () => {
  return notification()
}
