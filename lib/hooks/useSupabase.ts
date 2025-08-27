import { useState, useEffect } from 'react'
import { StorageServiceManager } from '../storage/storageService'
import { supabase } from '../supabase'
import { logger } from '../utils/logger'

export const useSupabase = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check Supabase connection on mount
  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Test connection by making a simple query
      const { data, error: connectionError } = await supabase
        .from('templates')
        .select('count')
        .limit(1)

      if (connectionError) {
        throw connectionError
      }

      setIsConnected(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to Supabase')
      setIsConnected(false)
    } finally {
      setIsLoading(false)
    }
  }

  const switchToSupabase = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const storageManager = StorageServiceManager.getInstance()
      await storageManager.switchProvider('supabase')
      
      setIsConnected(true)
      logger.log('Successfully switched to Supabase storage')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to switch to Supabase')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const getCurrentProvider = () => {
    const storageManager = StorageServiceManager.getInstance()
    return storageManager.getCurrentProvider()
  }

  return {
    isConnected,
    isLoading,
    error,
    switchToSupabase,
    checkConnection,
    getCurrentProvider,
    isSupabaseActive: getCurrentProvider() === 'supabase'
  }
}
