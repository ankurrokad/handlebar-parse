'use client'

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
}

const commonEditorOptions = {
  minimap: { enabled: false },
  fontSize: 14,
  fontWeight: '500',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  lineNumbers: 'on',
  roundedSelection: false,
  scrollBeyondLastLine: false,
  automaticLayout: true,
  wordWrap: 'on',
  suggest: {
    showKeywords: true,
    showSnippets: true,
    showClasses: true,
    showFunctions: true,
    showVariables: true,
  },
  multiCursorModifier: 'alt',
  accessibilitySupport: 'on',
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
        options={getLanguageSpecificOptions()}
      />
    </div>
  )
}
