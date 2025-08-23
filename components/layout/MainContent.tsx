'use client'

import { LeftPanel } from '@/components/editor/LeftPanel'
import { RightPanel } from '@/components/preview/RightPanel'

interface MainContentProps {
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
  compiledHtml: string
  error: string
}

export const MainContent = ({
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
  onCopyCurrentTab,
  compiledHtml,
  error
}: MainContentProps) => {
  return (
    <div className="relative z-10 grid grid-cols-1 xl:grid-cols-2 divide-x divide-[#333333]" style={{ height: 'calc(100vh - 32px)' }}>
      <LeftPanel
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        template={template}
        data={data}
        layout={layout}
        styles={styles}
        onTemplateChange={onTemplateChange}
        onDataChange={onDataChange}
        onLayoutChange={onLayoutChange}
        onStylesChange={onStylesChange}
        isDarkTheme={isDarkTheme}
        lastSaved={lastSaved}
        onCopyCurrentTab={onCopyCurrentTab}
      />

      <RightPanel
        compiledHtml={compiledHtml}
        error={error}
        isDarkTheme={isDarkTheme}
      />
    </div>
  )
}
