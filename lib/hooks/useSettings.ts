import { useState, useEffect } from 'react'

export interface UserSettings {
  weazyPrintUrl: string
}

const DEFAULT_SETTINGS: UserSettings = {
  weazyPrintUrl: ''
}

const SETTINGS_STORAGE_KEY = 'hbs-parser-user-settings'

export const useSettings = () => {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setSettings({ ...DEFAULT_SETTINGS, ...parsed })
      }
    } catch (error) {
      console.error('Failed to load settings from localStorage:', error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save settings to localStorage
  const saveSettings = (newSettings: Partial<UserSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings }
      setSettings(updatedSettings)
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updatedSettings))
      return true
    } catch (error) {
      console.error('Failed to save settings to localStorage:', error)
      return false
    }
  }

  // Reset settings to defaults
  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS)
    localStorage.removeItem(SETTINGS_STORAGE_KEY)
  }

  // Update a specific setting
  const updateSetting = <K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K]
  ) => {
    saveSettings({ [key]: value })
  }

  return {
    settings,
    isLoaded,
    saveSettings,
    resetSettings,
    updateSetting
  }
}
