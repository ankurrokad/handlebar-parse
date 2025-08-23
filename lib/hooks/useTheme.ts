import { useState, useEffect } from 'react'

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

  const saveThemePreference = (theme: boolean) => {
    try {
      localStorage.setItem('hbs-parser-theme', theme ? 'dark' : 'light')
    } catch (err) {
      console.warn('Failed to save theme preference:', err)
    }
  }

  // Load saved theme from localStorage on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('hbs-parser-theme')
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
