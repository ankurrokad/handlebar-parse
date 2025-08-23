'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from './button'
import { Card } from './card'
import { useStorage } from '@/lib/hooks'
import { StorageProvider } from '@/lib/storage'

export const StorageSettings = () => {
  const { currentProvider, isLoading, error, switchStorageProvider, getStorageInfo } = useStorage()
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleProviderSwitch = async (provider: StorageProvider) => {
    try {
      await switchStorageProvider(provider)
    } catch (err) {
      console.error('Failed to switch provider:', err)
    }
  }

  const storageInfo = getStorageInfo()

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Storage Settings</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? 'Hide' : 'Advanced'}
        </Button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Current Provider:</span>
          <span className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
            {currentProvider}
          </span>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-600 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded"
          >
            {error}
          </motion.div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={storageInfo.isLocalStorage ? "default" : "outline"}
            size="sm"
            onClick={() => handleProviderSwitch('localStorage')}
            disabled={isLoading || storageInfo.isLocalStorage}
            className="text-xs"
          >
            {isLoading && storageInfo.isLocalStorage ? 'Switching...' : 'LocalStorage'}
          </Button>

          <Button
            variant={storageInfo.isIndexedDB ? "default" : "outline"}
            size="sm"
            onClick={() => handleProviderSwitch('indexedDB')}
            disabled={isLoading || storageInfo.isIndexedDB}
            className="text-xs"
          >
            {isLoading && storageInfo.isIndexedDB ? 'Switching...' : 'IndexedDB'}
          </Button>
        </div>

        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-3 pt-3 border-t"
          >
            <div className="text-sm text-gray-600">
              <p><strong>LocalStorage:</strong> Browser storage, data persists until cleared</p>
              <p><strong>IndexedDB:</strong> Browser database, larger storage capacity</p>
              <p><strong>Cloud Storage:</strong> Coming soon (MongoDB, Supabase)</p>
            </div>

            <div className="text-xs text-gray-500">
              <p>Note: Switching providers will automatically migrate your existing data.</p>
            </div>
          </motion.div>
        )}
      </div>
    </Card>
  )
}
