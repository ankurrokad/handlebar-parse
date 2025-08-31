'use client'

import { useState } from 'react'
import { Settings, X } from 'lucide-react'
import { UserSettings, useSettings } from '@/lib/hooks/useSettings'
// Note: Uncomment these imports once Formik is installed
// import { Formik, Form, Field, ErrorMessage } from 'formik'
// import * as Yup from 'yup'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

// Note: Uncomment this validation schema once Yup is installed
// const validationSchema = Yup.object({
//   weazyPrintUrl: Yup.string()
//     .url('Please enter a valid URL')
//     .required('WeazyPrint URL is required')
// })

export const SettingsModalFormik = ({ isOpen, onClose }: SettingsModalProps) => {
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
      console.error('Failed to save settings:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    resetSettings()
  }

  // This is the Formik version - uncomment once Formik is installed
  /*
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg w-full max-w-md mx-4">
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

        <Formik
          initialValues={settings}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isValid, dirty }) => (
            <Form className="p-4 space-y-4">
              <div>
                <label htmlFor="weazyPrintUrl" className="block text-sm font-medium text-gray-300 mb-2">
                  WeazyPrint URL
                </label>
                <Field
                  type="url"
                  id="weazyPrintUrl"
                  name="weazyPrintUrl"
                  placeholder="https://api.weazyprint.com/..."
                  className="w-full px-3 py-2 bg-[#2A2A2A] border border-[#444444] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0070F3] focus:border-transparent"
                />
                <ErrorMessage
                  name="weazyPrintUrl"
                  component="div"
                  className="mt-1 text-xs text-red-400"
                />
                <p className="mt-1 text-xs text-gray-500">
                  The URL endpoint for WeazyPrint API
                </p>
              </div>

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
                    disabled={isSubmitting || !isValid || !dirty}
                    className="px-4 py-2 text-sm bg-[#0070F3] text-white rounded-md hover:bg-[#0051CC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
  */

  // Fallback to basic form until Formik is installed
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const values: UserSettings = {
      weazyPrintUrl: formData.get('weazyPrintUrl') as string || ''
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
