'use client'

import { Code2, Play, Square, Sun, Moon, Layers, RotateCcw } from 'lucide-react'

interface HeaderProps {
  isPlaying: boolean
  useLayout: boolean
  isDarkTheme: boolean
  onToggleAutoPlay: () => void
  onToggleLayout: () => void
  onToggleTheme: () => void
  onResetToDefaults: () => void
}

export const Header = ({
  isPlaying,
  useLayout,
  isDarkTheme,
  onToggleAutoPlay,
  onToggleLayout,
  onToggleTheme,
  onResetToDefaults
}: HeaderProps) => {
  return (
    <header className="h-8 bg-[#0A0A0A] border-b border-[#333333] flex items-center justify-between px-2 select-none" style={{ height: '32px' }}>
      <div className="flex items-center space-x-2">
        <Code2 className="h-4 w-4 text-[#0070F3]" />
        <span className="text-xs text-gray-500">HBS Parser</span>
      </div>
      
      <div className="flex items-center space-x-1">
        <button
          onClick={onToggleAutoPlay}
          className={`p-1 rounded text-xs flex items-center ${
            isPlaying 
              ? 'text-[#28C840] hover:bg-[#28C840]/10' 
              : 'text-gray-500 hover:bg-[#161616]'
          }`}
          title={isPlaying ? "Auto-play ON" : "Auto-play OFF"}
        >
          {isPlaying ? <Square className="h-3 w-3" /> : <Play className="h-3 w-3" />}
        </button>
        
        <button
          onClick={onToggleLayout}
          className={`p-1 rounded text-xs flex items-center ${
            useLayout 
              ? 'text-[#0070F3] hover:bg-[#0070F3]/10' 
              : 'text-gray-500 hover:bg-[#161616]'
          }`}
          title={useLayout ? "Layout ON" : "Layout OFF"}
        >
          <Layers className="h-3 w-3" />
        </button>
        
        <button
          onClick={onToggleTheme}
          className="p-1 rounded text-gray-500 hover:bg-[#161616]"
          title="Toggle theme"
        >
          {isDarkTheme ? <Sun className="h-3 w-3" /> : <Moon className="h-3 w-3" />}
        </button>
        
        <button
          onClick={onResetToDefaults}
          className="p-1 rounded text-gray-500 hover:bg-[#161616]"
          title="Reset to defaults"
        >
          <RotateCcw className="h-3 w-3" />
        </button>
      </div>
    </header>
  )
}
