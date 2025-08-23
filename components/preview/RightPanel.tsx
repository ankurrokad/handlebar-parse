'use client'

import { motion } from 'framer-motion'
import { PreviewPanel } from './PreviewPanel'

interface RightPanelProps {
  compiledHtml: string
  error: string
  isDarkTheme: boolean
}

export const RightPanel = ({
  compiledHtml,
  error,
  isDarkTheme
}: RightPanelProps) => {
  return (
    <motion.div 
      className="h-full"
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <PreviewPanel
        compiledHtml={compiledHtml}
        error={error}
        isDarkTheme={isDarkTheme}
      />
    </motion.div>
  )
}
