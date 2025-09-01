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
  }

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
