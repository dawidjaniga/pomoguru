import path from 'path'

export type NotifyOptions = {
  body?: string
  icon?: string
  image?: string
  title?: string
  sound?: string
}

const title = 'Pomoguru'

const defaultOptions: NotifyOptions = {
  body: 'Notification content',
  sound: 'hero',
  icon: path.join(__dirname, 'icon.png')
}

// @TODO: How to correctly type that?

const NotificationService = {
  notify (options: NotifyOptions) {
    new Notification(title, {
      ...defaultOptions,
      ...options
    })
  }
}

export default NotificationService
