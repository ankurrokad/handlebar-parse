import { useState, useEffect } from 'react'
import { storageService } from '@/lib/storage'

export const useStorage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Initialize storage service on mount
    const initStorage = async () => {
      try {
        // Verify Supabase connection
        await storageService.getService()
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize Supabase storage'
        setError(errorMessage)
        console.error('Storage initialization failed:', err)
      }
    }
    
    initStorage()
  }, [])

  const getStorageInfo = () => {
    return {
      provider: 'supabase',
      isSupabase: true
    }
  }

  const clearStorage = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      await storageService.clearAll()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to clear storage'
      setError(errorMessage)
      console.error('Storage clear failed:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    getStorageInfo,
    clearStorage
  }
}
