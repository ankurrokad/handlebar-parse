'use client'

import { motion } from 'framer-motion'
import { TabNavigation } from './TabNavigation'
import { EditorPanel } from './EditorPanel'

interface LeftPanelProps {
  activeTab: 'template' | 'data' | 'layout' | 'styles'
  setActiveTab: (tab: 'template' | 'data' | 'layout' | 'styles') => void
  template: string
  data: string
  layout: string
  styles: string
  onTemplateChange: (value: string | undefined) => void
  onDataChange: (value: string | undefined) => void
  onLayoutChange: (value: string | undefined) => void
  onStylesChange: (value: string | undefined) => void
  isDarkTheme: boolean
  lastSaved: Date | null
  onCopyCurrentTab: () => void
}

export const LeftPanel = ({
  activeTab,
  setActiveTab,
  template,
  data,
  layout,
  styles,
  onTemplateChange,
  onDataChange,
  onLayoutChange,
  onStylesChange,
  isDarkTheme,
  lastSaved,
  onCopyCurrentTab
}: LeftPanelProps) => {
  return (
    <motion.div 
      className="h-full"
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="h-full flex flex-col">
        <TabNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          lastSaved={lastSaved}
          onCopyCurrentTab={onCopyCurrentTab}
        />
        
        <EditorPanel
          activeTab={activeTab}
          template={template}
          data={data}
          layout={layout}
          styles={styles}
          onTemplateChange={onTemplateChange}
          onDataChange={onDataChange}
          onLayoutChange={onLayoutChange}
          onStylesChange={onStylesChange}
          isDarkTheme={isDarkTheme}
        />
      </div>
    </motion.div>
  )
}
