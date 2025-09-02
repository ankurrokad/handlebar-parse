'use client'

import { useRef, useEffect, useMemo, useCallback } from 'react'
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
  const editorRef = useRef<any>(null)

  const currentContent = useMemo(() => {
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
  }, [activeTab, template, data, layout, styles, onTemplateChange, onDataChange, onLayoutChange, onStylesChange])

  // Update editor language when tab changes
  const updateEditorLanguage = useCallback(() => {
    if (editorRef.current) {
      const editor = editorRef.current
      const monaco = (window as any).monaco
      
      if (monaco && editor) {
        // Get the current model
        const model = editor.getModel()
        if (model) {
          // Set the new language
          monaco.editor.setModelLanguage(model, currentContent.language)
        }
      }
    }
  }, [currentContent.language])

  useEffect(() => {
    updateEditorLanguage()
  }, [updateEditorLanguage])

  return (
    <div className="flex-1 relative">
      <MonacoEditor
        ref={editorRef}
        value={currentContent.value}
        onChange={currentContent.onChange}
        language={currentContent.language}
        theme={isDarkTheme ? "vs-dark" : "light"}
        importType={currentContent.importType}
        onCopy={() => {}} // This will be handled by the parent
        title={currentContent.title}
      />
    </div>
  )
}
