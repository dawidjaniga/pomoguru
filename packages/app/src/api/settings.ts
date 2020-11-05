const settingsKey = 'settings'
type SettingName =
  | 'focus-time-duration-in-seconds'
  | 'break-time-duration-in-seconds'

const defaultSettings = {
  'focus-time-duration-in-seconds': 1500,
  'break-time-duration-in-seconds': 300
}

function saveSettings (settings: object) {
  localStorage.setItem(settingsKey, JSON.stringify(settings))
}

function readSettings () {
  const settings = localStorage.getItem(settingsKey)

  if (settings) {
    return JSON.parse(settings)
  }

  return {}
}

const api = {
  set (name: SettingName, value: number | string | boolean) {
    const settings = readSettings()
    settings[name] = value
    saveSettings(settings)
  },
  get (name: SettingName) {
    const settings = readSettings()
    return settings[name] ?? defaultSettings[name]
  }
}

export default api
