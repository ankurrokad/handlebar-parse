import { useState, useEffect, useCallback } from 'react'
import { basicHtmlSanitize } from '@/lib/utils/validation'

/**
 * Custom hook for HTML sanitization that handles both client and server-side scenarios
 * Uses DOMPurify when available, falls back to basic sanitization when not
 */
export function useHtmlSanitizer() {
  const [isClient, setIsClient] = useState(false)
  const [dompurifyAvailable, setDompurifyAvailable] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const sanitizeHtml = useCallback(async (html: string): Promise<string> => {
    if (!html) return ''
    
    // If not on client side, use basic sanitization
    if (!isClient) {
      return basicHtmlSanitize(html)
    }

    // Try to use DOMPurify if available
    if (dompurifyAvailable) {
      try {
        const DOMPurify = (await import('dompurify')).default
        return DOMPurify.sanitize(html)
      } catch (error) {
        console.warn('Failed to sanitize HTML with DOMPurify, using fallback:', error)
        return basicHtmlSanitize(html)
      }
    }

    // Check if DOMPurify is available
    try {
      const DOMPurify = (await import('dompurify')).default
      setDompurifyAvailable(true)
      return DOMPurify.sanitize(html)
    } catch (error) {
      console.warn('DOMPurify not available, using basic sanitization:', error)
      return basicHtmlSanitize(html)
    }
  }, [isClient, dompurifyAvailable])

  return {
    sanitizeHtml,
    isClient,
    dompurifyAvailable
  }
}
