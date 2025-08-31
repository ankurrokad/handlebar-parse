'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Code2, Copy, Printer } from 'lucide-react'
import { handleCopyHtml } from '@/lib/utils/fileUtils'
import { useHtmlSanitizer, useSettings } from '@/lib/hooks'
import { useEffect, useState } from 'react'
import { printWithWeazyPrint } from '@/lib/utils/weazyPrintUtils'

interface PreviewPanelProps {
  compiledHtml: string
  error: string
  isDarkTheme: boolean
}

export const PreviewPanel = ({
  compiledHtml,
  error,
  isDarkTheme
}: PreviewPanelProps) => {
  const [sanitizedHtml, setSanitizedHtml] = useState<string>('')
  const [isPrinting, setIsPrinting] = useState(false)
  const { sanitizeHtml, isClient } = useHtmlSanitizer()
  const { settings } = useSettings()

  useEffect(() => {
    if (compiledHtml) {
      sanitizeHtml(compiledHtml).then(setSanitizedHtml)
    }
  }, [compiledHtml, sanitizeHtml])

  const handlePrint = async () => {
    if (!settings.weazyPrintUrl) {
      alert('Please configure WeazyPrint URL in settings first.')
      return
    }

    setIsPrinting(true)
    try {
      const result = await printWithWeazyPrint(settings.weazyPrintUrl, compiledHtml)
      if (!result.success) {
        alert(`Print failed: ${result.error}`)
      }
    } catch (error) {
      console.error('Print error:', error)
      alert('Failed to print. Please check your WeazyPrint configuration.')
    } finally {
      setIsPrinting(false)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="h-7 bg-[#0A0A0A] border-b border-[#333333] flex items-center px-3 justify-between">
        <div className="flex items-center space-x-1.5">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57] opacity-75"></div>
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E] opacity-75"></div>
            <div className="w-3 h-3 rounded-full bg-[#28C840] opacity-75"></div>
          </div>
          <span className="text-xs text-gray-500">Preview</span>
        </div>
        
        <div className="flex items-center space-x-2">
          {error && (
            <div className="text-xs px-2 py-0.5 rounded bg-[#450A0A] border border-red-900/50 text-red-500">
              Error
            </div>
          )}
          
          {/* Print Button - Only show if WeazyPrint URL is configured */}
          {settings.weazyPrintUrl && (
            <button
              onClick={handlePrint}
              disabled={isPrinting || !compiledHtml}
              className={`p-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                isPrinting 
                  ? 'text-[#0070F3] bg-[#0070F3]/10' 
                  : 'text-gray-500 hover:bg-[#161616] hover:text-gray-300'
              }`}
              title={isPrinting ? "Printing..." : "Print to PDF using WeazyPrint"}
            >
              <Printer className={`h-3 w-3 ${isPrinting ? 'animate-pulse' : ''}`} />
            </button>
          )}
          
          {/* Copy HTML Button */}
          <button
            onClick={() => handleCopyHtml(compiledHtml)}
            className="p-1 rounded text-gray-500 hover:bg-[#161616] hover:text-gray-300 transition-colors"
            title="Copy HTML to clipboard"
          >
            <Copy className="h-3 w-3" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-white dark:bg-black">
        <AnimatePresence mode="wait">
          {error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4"
            >
              <div className="rounded-lg border border-red-900/50 bg-[#450A0A] p-4">
                <div className="flex items-center space-x-2 text-red-500 text-sm mb-2">
                  <Code2 className="h-4 w-4" />
                  <span className="font-medium">Compilation Error</span>
                </div>
                <pre className="text-xs font-mono text-red-400/90 whitespace-pre-wrap">{error}</pre>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`prose max-w-none ${isDarkTheme ? 'prose-invert prose-pre:bg-[#161616] prose-pre:text-gray-300' : ''} p-4`}
              dangerouslySetInnerHTML={{ __html: isClient ? sanitizedHtml : compiledHtml }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
