import { useState, useEffect } from 'react'
import { supabase } from '../supabase/client'
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

  return {
    isConnected,
    isLoading,
    error,
    checkConnection,
    isSupabaseActive: true // Always true since we only use Supabase
  }
}
