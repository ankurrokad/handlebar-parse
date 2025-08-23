import { useState, useEffect } from 'react'
import { storageService, StorageProvider } from '@/lib/storage'

export const useStorage = () => {
  const [currentProvider, setCurrentProvider] = useState<StorageProvider>('localStorage')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Get current provider on mount
    setCurrentProvider(storageService.getCurrentProvider())
  }, [])

  const switchStorageProvider = async (provider: StorageProvider, options?: Record<string, any>) => {
    setIsLoading(true)
    setError(null)
    
    try {
      await storageService.switchProvider(provider, options)
      setCurrentProvider(provider)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to switch storage provider'
      setError(errorMessage)
      console.error('Storage provider switch failed:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const getStorageInfo = () => {
    const config = storageService.getConfig()
    return {
      provider: config.provider,
      options: config.options,
      isLocalStorage: config.provider === 'localStorage',
      isIndexedDB: config.provider === 'indexedDB',
      isCloud: ['mongodb', 'supabase'].includes(config.provider)
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
    currentProvider,
    isLoading,
    error,
    switchStorageProvider,
    getStorageInfo,
    clearStorage,
    // Convenience methods
    switchToLocalStorage: () => switchStorageProvider('localStorage'),
    switchToIndexedDB: () => switchStorageProvider('indexedDB'),
    switchToMongoDB: (options?: Record<string, any>) => switchStorageProvider('mongodb', options),
    switchToSupabase: (options?: Record<string, any>) => switchStorageProvider('supabase', options)
  }
}
