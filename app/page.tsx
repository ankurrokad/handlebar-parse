'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Suspense } from 'react'
import { Loading } from '@/components/loading'
import { Header, Background, MainContent } from '@/components'
import { useEditor, useTheme } from '@/lib/hooks'
import { handleCopyContent } from '@/lib/utils/fileUtils'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'template' | 'data' | 'layout' | 'styles'>('layout')
  
  const editor = useEditor()
  const { isDarkTheme, toggleTheme } = useTheme()

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
    let contentToCopy = ''
    if (activeTab === 'template') contentToCopy = editor.template
    else if (activeTab === 'data') contentToCopy = editor.data
    else if (activeTab === 'styles') contentToCopy = editor.styles
    else if (activeTab === 'layout') contentToCopy = editor.layout
    
    if (contentToCopy) {
      handleCopyContent(contentToCopy)
    }
  }

  return (
    <Suspense fallback={<Loading />}>
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
          onToggleAutoPlay={editor.toggleAutoPlay}
          onToggleLayout={editor.toggleLayout}
          onToggleTheme={toggleTheme}
          onResetToDefaults={editor.resetToDefaults}
        />

        <MainContent
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          template={editor.template}
          data={editor.data}
          layout={editor.layout}
          styles={editor.styles}
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
    </Suspense>
  )
}
