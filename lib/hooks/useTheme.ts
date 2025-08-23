import { useState, useEffect } from 'react'
import { storageService } from '@/lib/storage'

export const useTheme = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(true)

  const toggleTheme = () => {
    const newTheme = !isDarkTheme
    setIsDarkTheme(newTheme)
    
    // Update body class for global dark mode
    if (newTheme) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
    // Save theme preference
    saveThemePreference(newTheme)
  }

  const saveThemePreference = async (theme: boolean) => {
    try {
      await storageService.saveTheme(theme ? 'dark' : 'light')
    } catch (err) {
      console.warn('Failed to save theme preference:', err)
    }
  }

  // Load saved theme from storage on mount
  useEffect(() => {
    const loadSavedTheme = async () => {
      try {
        const savedTheme = await storageService.getTheme()
        if (savedTheme) {
          const isDark = savedTheme === 'dark'
          setIsDarkTheme(isDark)
          
          // Apply theme immediately
          if (isDark) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
        }
      } catch (err) {
        console.warn('Failed to load theme preference:', err)
      }
    }
    
    loadSavedTheme()
  }, [])

  // Set initial theme on mount
  useEffect(() => {
    if (isDarkTheme) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  return {
    isDarkTheme,
    toggleTheme
  }
}
