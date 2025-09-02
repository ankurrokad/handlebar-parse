'use client'

import { useState } from 'react'
import { Settings, X } from 'lucide-react'
import { UserSettings, useSettings } from '@/lib/hooks/useSettings'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const { settings, saveSettings, resetSettings } = useSettings()
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (values: UserSettings) => {
    setIsSubmitting(true)
    try {
      const success = saveSettings(values)
      if (success) {
        onClose()
      }
    } catch (error) {
      // Silently handle settings save errors
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    resetSettings()
  }

  // Simple form handling without external libraries for now
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const values: UserSettings = {
      weazyPrintUrl: formData.get('weazyPrintUrl') as string || '',
      smtpHost: formData.get('smtpHost') as string || '',
      smtpPort: parseInt(formData.get('smtpPort') as string) || 587,
      smtpUsername: formData.get('smtpUsername') as string || '',
      smtpPassword: formData.get('smtpPassword') as string || '',
      fromEmail: formData.get('fromEmail') as string || '',
      fromName: formData.get('fromName') as string || ''
    }
    handleSubmit(values)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#333333]">
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-[#0070F3]" />
            <h2 className="text-lg font-semibold text-white">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-gray-400 hover:text-white hover:bg-[#333333]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="p-4 space-y-4">
          {/* WeazyPrint URL Field */}
          <div>
            <label htmlFor="weazyPrintUrl" className="block text-sm font-medium text-gray-300 mb-2">
              WeazyPrint URL
            </label>
            <input
              type="url"
              id="weazyPrintUrl"
              name="weazyPrintUrl"
              defaultValue={settings.weazyPrintUrl}
              placeholder="https://api.weazyprint.com/..."
              className="w-full px-3 py-2 bg-[#2A2A2A] border border-[#444444] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0070F3] focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">
              The URL endpoint for WeazyPrint API
            </p>
          </div>

          {/* SMTP Settings Section */}
          <div className="border-t border-[#333333] pt-4">
            <h3 className="text-sm font-medium text-gray-300 mb-3">Email Settings (SMTP)</h3>
            
            {/* SMTP Host */}
            <div className="mb-3">
              <label htmlFor="smtpHost" className="block text-sm font-medium text-gray-300 mb-2">
                SMTP Host
              </label>
              <input
                type="text"
                id="smtpHost"
                name="smtpHost"
                defaultValue={settings.smtpHost}
                placeholder="smtp.gmail.com"
                className="w-full px-3 py-2 bg-[#2A2A2A] border border-[#444444] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0070F3] focus:border-transparent"
              />
            </div>

            {/* SMTP Port */}
            <div className="mb-3">
              <label htmlFor="smtpPort" className="block text-sm font-medium text-gray-300 mb-2">
                SMTP Port
              </label>
              <input
                type="number"
                id="smtpPort"
                name="smtpPort"
                defaultValue={settings.smtpPort}
                placeholder="587"
                className="w-full px-3 py-2 bg-[#2A2A2A] border border-[#444444] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0070F3] focus:border-transparent"
              />
            </div>

            {/* SMTP Username */}
            <div className="mb-3">
              <label htmlFor="smtpUsername" className="block text-sm font-medium text-gray-300 mb-2">
                SMTP Username
              </label>
              <input
                type="text"
                id="smtpUsername"
                name="smtpUsername"
                defaultValue={settings.smtpUsername}
                placeholder="your-email@gmail.com"
                className="w-full px-3 py-2 bg-[#2A2A2A] border border-[#444444] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0070F3] focus:border-transparent"
              />
            </div>

            {/* SMTP Password */}
            <div className="mb-3">
              <label htmlFor="smtpPassword" className="block text-sm font-medium text-gray-300 mb-2">
                SMTP Password
              </label>
              <input
                type="password"
                id="smtpPassword"
                name="smtpPassword"
                defaultValue={settings.smtpPassword}
                placeholder="your-app-password"
                className="w-full px-3 py-2 bg-[#2A2A2A] border border-[#444444] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0070F3] focus:border-transparent"
              />
            </div>

            {/* From Email */}
            <div className="mb-3">
              <label htmlFor="fromEmail" className="block text-sm font-medium text-gray-300 mb-2">
                From Email
              </label>
              <input
                type="email"
                id="fromEmail"
                name="fromEmail"
                defaultValue={settings.fromEmail}
                placeholder="sender@example.com"
                className="w-full px-3 py-2 bg-[#2A2A2A] border border-[#444444] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0070F3] focus:border-transparent"
              />
            </div>

            {/* From Name */}
            <div className="mb-3">
              <label htmlFor="fromName" className="block text-sm font-medium text-gray-300 mb-2">
                From Name
              </label>
              <input
                type="text"
                id="fromName"
                name="fromName"
                defaultValue={settings.fromName}
                placeholder="Your Name"
                className="w-full px-3 py-2 bg-[#2A2A2A] border border-[#444444] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0070F3] focus:border-transparent"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white border border-[#444444] rounded-md hover:bg-[#333333] transition-colors"
            >
              Reset to Defaults
            </button>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white border border-[#444444] rounded-md hover:bg-[#333333] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm bg-[#0070F3] text-white rounded-md hover:bg-[#0051CC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
