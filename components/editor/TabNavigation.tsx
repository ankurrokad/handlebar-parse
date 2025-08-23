'use client'

import { motion } from 'framer-motion'
import { Code2, FileJson, Eye, Copy, Layout, CheckCircle } from 'lucide-react'

interface TabNavigationProps {
  activeTab: 'template' | 'data' | 'layout' | 'styles'
  setActiveTab: (tab: 'template' | 'data' | 'layout' | 'styles') => void
  lastSaved: Date | null
  onCopyCurrentTab: () => void
}

export const TabNavigation = ({
  activeTab,
  setActiveTab,
  lastSaved,
  onCopyCurrentTab
}: TabNavigationProps) => {
  const tabs = [
    { id: 'layout', label: 'layout.html', icon: Layout },
    { id: 'template', label: 'body.hbs', icon: Code2 },
    { id: 'data', label: 'data.json', icon: FileJson },
    { id: 'styles', label: 'styles.css', icon: Eye }
  ] as const

  return (
    <div className="flex h-7 bg-[#0A0A0A] border-b border-[#333333]">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-1.5 px-3 text-xs relative ${
              isActive 
                ? 'bg-black text-gray-200' 
                : 'text-gray-500 hover:text-gray-300 hover:bg-[#161616]'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            <span>{tab.label}</span>
            {isActive && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500"
                layoutId="activeTab"
              />
            )}
          </button>
        )
      })}
      
      <div className="flex-1"></div>
      
      {/* Save Status Indicator */}
      {lastSaved && (
        <motion.div 
          className="flex items-center px-2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          key={lastSaved.getTime()}
        >
          <motion.div
            className="flex items-center space-x-1 text-xs text-[#28C840]"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [1, 0.8, 1]
            }}
            transition={{ 
              duration: 0.6,
              repeat: 2,
              ease: "easeInOut"
            }}
          >
            <CheckCircle className="h-3 w-3" />
          </motion.div>
        </motion.div>
      )}
      
      {/* Copy Current Tab Button */}
      <button
        onClick={onCopyCurrentTab}
        className="p-1 rounded text-gray-500 hover:bg-[#161616] hover:text-gray-300 transition-colors"
        title={`Copy ${activeTab === 'template' ? 'template' : activeTab === 'data' ? 'data' : activeTab === 'styles' ? 'styles' : 'layout'} content`}
      >
        <Copy className="h-3 w-3" />
      </button>
    </div>
  )
}
