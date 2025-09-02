'use client'

import { useState } from 'react'
import { Mail, X, Send } from 'lucide-react'
import { useSettings } from '@/lib/hooks/useSettings'
import { sendEmailWithSMTP, openEmailDialog } from '@/lib/utils/emailUtils'

interface EmailModalProps {
  isOpen: boolean
  onClose: () => void
  htmlContent: string
}

export const EmailModal = ({ isOpen, onClose, htmlContent }: EmailModalProps) => {
  const { settings } = useSettings()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailData, setEmailData] = useState({
    to: '',
    subject: 'HBS Parser Output',
    message: ''
  })

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!settings.smtpHost || !settings.smtpUsername || !settings.smtpPassword) {
      alert('Please configure SMTP settings first.')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await sendEmailWithSMTP({
        to: emailData.to,
        subject: emailData.subject,
        html: htmlContent,
        credentials: {
          smtpHost: settings.smtpHost,
          smtpPort: settings.smtpPort,
          smtpUsername: settings.smtpUsername,
          smtpPassword: settings.smtpPassword,
          fromEmail: settings.fromEmail,
          fromName: settings.fromName
        }
      })

      if (result.success) {
        alert('Email sent successfully!')
        onClose()
      } else {
        alert(`Failed to send email: ${result.error}`)
      }
    } catch (error) {
      alert('Failed to send email. Please check your SMTP configuration.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFallbackEmail = () => {
    openEmailDialog(htmlContent, emailData.subject)
    onClose()
  }

  const isSMTPConfigured = settings.smtpHost && settings.smtpUsername && settings.smtpPassword

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#333333]">
          <div className="flex items-center space-x-2">
            <Mail className="h-5 w-5 text-[#0070F3]" />
            <h2 className="text-lg font-semibold text-white">Send Email</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-gray-400 hover:text-white hover:bg-[#333333]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* To Email */}
          <div>
            <label htmlFor="to" className="block text-sm font-medium text-gray-300 mb-2">
              To Email *
            </label>
            <input
              type="email"
              id="to"
              required
              value={emailData.to}
              onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
              placeholder="recipient@example.com"
              className="w-full px-3 py-2 bg-[#2A2A2A] border border-[#444444] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0070F3] focus:border-transparent"
            />
          </div>

          {/* Subject */}
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              value={emailData.subject}
              onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
              placeholder="Email subject"
              className="w-full px-3 py-2 bg-[#2A2A2A] border border-[#444444] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0070F3] focus:border-transparent"
            />
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
              Additional Message (Optional)
            </label>
            <textarea
              id="message"
              value={emailData.message}
              onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
              placeholder="Add a personal message..."
              rows={3}
              className="w-full px-3 py-2 bg-[#2A2A2A] border border-[#444444] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0070F3] focus:border-transparent resize-none"
            />
          </div>

          {/* SMTP Status */}
          {!isSMTPConfigured && (
            <div className="p-3 bg-[#450A0A] border border-red-900/50 rounded-md">
              <p className="text-xs text-red-400">
                SMTP not configured. Please configure SMTP settings first, or use the fallback option.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white border border-[#444444] rounded-md hover:bg-[#333333] transition-colors"
            >
              Cancel
            </button>
            <div className="flex space-x-2">
              {!isSMTPConfigured && (
                <button
                  type="button"
                  onClick={handleFallbackEmail}
                  className="px-4 py-2 text-sm text-gray-300 hover:text-white border border-[#444444] rounded-md hover:bg-[#333333] transition-colors"
                >
                  Use Mail App
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting || !isSMTPConfigured}
                className="px-4 py-2 text-sm bg-[#0070F3] text-white rounded-md hover:bg-[#0051CC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>{isSubmitting ? 'Sending...' : 'Send Email'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
