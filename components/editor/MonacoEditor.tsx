'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Upload, Copy } from 'lucide-react'
import Editor from '@monaco-editor/react'
import { Button } from '@/components/ui/button'
import { handleImport, handleCopyContent } from '@/lib/utils/fileUtils'

interface MonacoEditorProps {
  value: string
  onChange: (value: string | undefined) => void
  language: 'handlebars' | 'json' | 'css' | 'html'
  theme: 'vs-dark' | 'light'
  importType: 'template' | 'data' | 'layout' | 'styles'
  onCopy: () => void
  title: string
}

// Add Monaco Editor mount handler
const handleEditorDidMount = (editor: any, monaco: any) => {
  // Ensure the editor has focus and keyboard shortcuts work
  editor.focus()
  
  // Force enable all default shortcuts
  editor.updateOptions({
    multiCursorModifier: 'alt',
    accessibilitySupport: 'on',
    quickSuggestions: true,
    selectOnLineNumbers: true,
  })
  
  // Ensure Ctrl+A works by adding explicit command
  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyA, () => {
    editor.trigger('keyboard', 'editor.action.selectAll', {})
  })
  
  // Mark as loaded
  setIsLoading(false)
}

const commonEditorOptions = {
  minimap: { enabled: false },
  fontSize: 14,
  fontWeight: '500',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  lineNumbers: 'on' as const,
  roundedSelection: false,
  scrollBeyondLastLine: false,
  automaticLayout: true,
  wordWrap: 'on' as const,
  suggest: {
    showKeywords: true,
    showSnippets: true,
    showClasses: true,
    showFunctions: true,
    showVariables: true,
  },
  multiCursorModifier: 'alt' as const,
  accessibilitySupport: 'on' as const,
  quickSuggestions: true,
  selectOnLineNumbers: true,
}

export const MonacoEditor = ({
  value,
  onChange,
  language,
  theme,
  importType,
  onCopy,
  title
}: MonacoEditorProps) => {
  const [monacoError, setMonacoError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  // Add timeout for Monaco loading
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        console.warn('Monaco Editor loading timeout, falling back to textarea')
        setMonacoError(true)
        setIsLoading(false)
      }
    }, 10000) // 10 second timeout
    
    return () => clearTimeout(timer)
  }, [isLoading])
  
  const getLanguageSpecificOptions = () => {
    if (language === 'json') {
      return {
        ...commonEditorOptions,
        formatOnPaste: true,
        formatOnType: true,
      }
    }
    return commonEditorOptions
  }

  const handleMonacoError = () => {
    console.warn('Monaco Editor failed to load, falling back to textarea')
    setMonacoError(true)
  }

  // Show loading state
  if (isLoading && !monacoError) {
    return (
      <div className="relative h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-sm text-gray-500">Loading editor...</p>
        </div>
      </div>
    )
  }

  // Fallback to textarea if Monaco fails
  if (monacoError) {
    return (
      <div className="relative h-full">
        <motion.div 
          className="absolute top-2 right-2 z-10"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleImport(importType, onChange)}
            className="glassmorphic-button"
            title={`Import ${title} file`}
          >
            <Upload className="h-4 w-4" />
          </Button>
        </motion.div>
        
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full h-full p-4 font-mono text-sm resize-none border-0 outline-none ${
            theme === 'vs-dark' 
              ? 'bg-gray-900 text-white' 
              : 'bg-white text-gray-900'
          }`}
          placeholder={`Enter ${title.toLowerCase()}...`}
        />
      </div>
    )
  }

  return (
    <div className="relative h-full">
      <motion.div 
        className="absolute top-2 right-2 z-10"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleImport(importType, onChange)}
          className="glassmorphic-button"
          title={`Import ${title} file`}
        >
          <Upload className="h-4 w-4" />
        </Button>
      </motion.div>
      
      <Editor
        height="100%"
        defaultLanguage={language}
        value={value}
        onChange={onChange}
        theme={theme}
        onMount={handleEditorDidMount}
        onError={handleMonacoError}
        options={getLanguageSpecificOptions()}
      />
    </div>
  )
}
