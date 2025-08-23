'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { MonacoEditor } from './MonacoEditor'

interface EditorPanelProps {
  activeTab: 'template' | 'data' | 'layout' | 'styles'
  template: string
  data: string
  layout: string
  styles: string
  onTemplateChange: (value: string | undefined) => void
  onDataChange: (value: string | undefined) => void
  onLayoutChange: (value: string | undefined) => void
  onStylesChange: (value: string | undefined) => void
  isDarkTheme: boolean
}

export const EditorPanel = ({
  activeTab,
  template,
  data,
  layout,
  styles,
  onTemplateChange,
  onDataChange,
  onLayoutChange,
  onStylesChange,
  isDarkTheme
}: EditorPanelProps) => {
  const getCurrentContent = () => {
    switch (activeTab) {
      case 'template':
        return {
          value: template,
          onChange: onTemplateChange,
          language: 'handlebars' as const,
          importType: 'template' as const,
          title: 'template'
        }
      case 'data':
        return {
          value: data,
          onChange: onDataChange,
          language: 'json' as const,
          importType: 'data' as const,
          title: 'data'
        }
      case 'styles':
        return {
          value: styles,
          onChange: onStylesChange,
          language: 'css' as const,
          importType: 'styles' as const,
          title: 'styles'
        }
      case 'layout':
        return {
          value: layout,
          onChange: onLayoutChange,
          language: 'html' as const,
          importType: 'layout' as const,
          title: 'layout'
        }
    }
  }

  const currentContent = getCurrentContent()

  return (
    <div className="flex-1 relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          className="absolute inset-0"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <MonacoEditor
            value={currentContent.value}
            onChange={currentContent.onChange}
            language={currentContent.language}
            theme={isDarkTheme ? "vs-dark" : "light"}
            importType={currentContent.importType}
            onCopy={() => {}} // This will be handled by the parent
            title={currentContent.title}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
