'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Header, Background, MainContent } from '@/components'
import { useEditor, useTheme } from '@/lib/hooks'
import { handleCopyContent } from '@/lib/utils/fileUtils'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'template' | 'data' | 'layout' | 'styles'>('layout')
  
  const editor = useEditor()
  const { isDarkTheme, toggleTheme } = useTheme()


  // Note: Templates are automatically saved when using Supabase storage
  // The storage service handles persistence automatically

  const handleTemplateChange = (value: string | undefined) => {
    const newValue = value || ''
    editor.updateField('template', newValue)
  }

  const handleDataChange = (value: string | undefined) => {
    const newValue = value || ''
    editor.updateField('data', newValue)
  }

  const handleLayoutChange = (value: string | undefined) => {
    const newValue = value || ''
    editor.updateField('layout', newValue)
  }
  
  const handleStylesChange = (value: string | undefined) => {
    const newValue = value || ''
    editor.updateField('styles', newValue)
  }

  const handleCopyCurrentTab = () => {
    if (!editor.currentTemplate) return
    
    let contentToCopy = ''
    if (activeTab === 'template') contentToCopy = editor.currentTemplate.template
    else if (activeTab === 'data') contentToCopy = editor.currentTemplate.data
    else if (activeTab === 'styles') contentToCopy = editor.currentTemplate.styles
    else if (activeTab === 'layout') contentToCopy = editor.currentTemplate.layout
    
    if (contentToCopy) {
      handleCopyContent(contentToCopy)
    }
  }

  // Show loading state while editor is initializing
  if (editor.isLoading || !editor.currentTemplate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading HBS Parser...</p>
          <p className="text-gray-400 text-sm mt-2">Initializing editor</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div 
      className={`min-h-screen ${isDarkTheme ? 'bg-[#000000]' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Background />

      <Header
        isPlaying={editor.isPlaying}
        useLayout={editor.useLayout}
        isDarkTheme={isDarkTheme}
        templates={editor.templates}
        currentTemplateId={editor.currentTemplateId}
        onToggleAutoPlay={editor.toggleAutoPlay}
        onToggleLayout={editor.toggleLayout}
        onToggleTheme={toggleTheme}
        onResetToDefaults={editor.resetToDefaults}
        onSwitchTemplate={editor.switchTemplate}
        onCreateTemplate={editor.createTemplate}
        onDeleteTemplate={editor.deleteTemplate}
        onRenameTemplate={editor.renameTemplate}
        onCopyTemplate={(template) => {
          const newName = `${template.name} (Copy)`
          const newSlug = `${template.slug}-copy`
          editor.createTemplate(newName, newSlug)
        }}
        onExportTemplate={editor.exportTemplate}
        onImportTemplate={editor.importTemplate}
      />

      <MainContent
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        template={editor.currentTemplate?.template || ''}
        data={editor.currentTemplate?.data || ''}
        layout={editor.currentTemplate?.layout || ''}
        styles={editor.currentTemplate?.styles || ''}
        onTemplateChange={handleTemplateChange}
        onDataChange={handleDataChange}
        onLayoutChange={handleLayoutChange}
        onStylesChange={handleStylesChange}
        isDarkTheme={isDarkTheme}
        lastSaved={editor.lastSaved}
        onCopyCurrentTab={handleCopyCurrentTab}
        compiledHtml={editor.compiledHtml}
        error={editor.error}
      />
    </motion.div>
  )
}
