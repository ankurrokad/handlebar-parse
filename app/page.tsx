'use client'

import { useState, useEffect } from 'react'
import { Code2, FileJson, Eye, Download, Upload, Play, Square, Sun, Moon } from 'lucide-react'
import Editor from '@monaco-editor/react'
import Handlebars from 'handlebars'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'template' | 'data'>('template')
  const [template, setTemplate] = useState(`<div class="container">
  <h1>{{title}}</h1>
  <p>{{description}}</p>
  
  {{#if showList}}
    <ul>
      {{#each items}}
        <li>{{name}} - {{price}}</li>
      {{/each}}
    </ul>
  {{/if}}
  
  <div class="footer">
    <p>Generated on {{formatDate date}}</p>
  </div>
</div>`)
  
  const [data, setData] = useState(`{
  "title": "Welcome to HBS Parser",
  "description": "A powerful tool for Handlebars template development",
  "showList": true,
  "items": [
    {"name": "Feature 1", "price": "$9.99"},
    {"name": "Feature 2", "price": "$19.99"},
    {"name": "Feature 3", "price": "$29.99"}
  ],
  "date": "2024-01-15"
}`)
  
  const [compiledHtml, setCompiledHtml] = useState('')
  const [error, setError] = useState('')
  const [isPlaying, setIsPlaying] = useState(true)
  const [isDarkTheme, setIsDarkTheme] = useState(true)

  // Custom Handlebars helpers
  useEffect(() => {
    Handlebars.registerHelper('formatDate', function(dateString) {
      return new Date(dateString).toLocaleDateString()
    })
    
    Handlebars.registerHelper('eq', function(a, b) {
      return a === b
    })
    
    Handlebars.registerHelper('gt', function(a, b) {
      return a > b
    })
    
    Handlebars.registerHelper('lt', function(a, b) {
      return a < b
    })
  }, [])

  // Compile template when template or data changes
  useEffect(() => {
    if (!isPlaying) return
    
    try {
      const parsedData = JSON.parse(data)
      const templateFn = Handlebars.compile(template)
      const result = templateFn(parsedData)
      setCompiledHtml(result)
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setCompiledHtml('')
    }
  }, [template, data, isPlaying])

  const handleTemplateChange = (value: string | undefined) => {
    setTemplate(value || '')
  }

  const handleDataChange = (value: string | undefined) => {
    setData(value || '')
  }

  const handleExport = () => {
    const blob = new Blob([compiledHtml], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'compiled-template.html'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (type: 'template' | 'data') => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = type === 'template' ? '.hbs,.html,.txt' : '.json,.txt'
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const content = e.target?.result as string
          if (type === 'template') {
            setTemplate(content)
          } else {
            setData(content)
          }
        }
        reader.readAsText(file)
      }
    }
    
    input.click()
  }

  const toggleAutoPlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleTheme = () => {
    const newTheme = !isDarkTheme
    setIsDarkTheme(newTheme)
    
    // Update body class for global dark mode
    if (newTheme) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Set initial theme on mount
  useEffect(() => {
    if (isDarkTheme) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  return (
    <motion.div 
      className={`min-h-screen ${isDarkTheme ? 'bg-[#000000]' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className="h-8 bg-[#0A0A0A] border-b border-[#333333] flex items-center justify-between px-2 select-none">
        <div className="flex items-center space-x-2">
          <Code2 className="h-4 w-4 text-[#0070F3]" />
          <span className="text-xs text-gray-500">HBS Parser</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={toggleAutoPlay}
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
            onClick={toggleTheme}
            className="p-1 rounded text-gray-500 hover:bg-[#161616]"
            title="Toggle theme"
          >
            {isDarkTheme ? <Sun className="h-3 w-3" /> : <Moon className="h-3 w-3" />}
          </button>
          
          <button
            onClick={handleExport}
            className="p-1 rounded text-gray-500 hover:bg-[#161616]"
            title="Export HTML"
          >
            <Download className="h-3 w-3" />
          </button>
        </div>
      </header>

      {/* Main Content - Full Width */}
      <div className="relative z-10 h-[calc(100vh-8px)] grid grid-cols-1 xl:grid-cols-2 divide-x divide-[#333333]">
        {/* Left Panel - Template & Data Editor */}
        <motion.div 
          className="h-full"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="h-full flex flex-col">
                            <div className="flex h-7 bg-[#0A0A0A] border-b border-[#333333]">
                  <button
                    onClick={() => setActiveTab('template')}
                    className={`flex items-center space-x-1.5 px-3 text-xs relative ${
                      activeTab === 'template' 
                        ? 'bg-black text-gray-200' 
                        : 'text-gray-500 hover:text-gray-300 hover:bg-[#161616]'
                    }`}
              >
                <Code2 className="h-3.5 w-3.5" />
                <span>template.hbs</span>
                {activeTab === 'template' && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500"
                    layoutId="activeTab"
                  />
                )}
              </button>
                                <button
                    onClick={() => setActiveTab('data')}
                    className={`flex items-center space-x-1.5 px-3 text-xs relative ${
                      activeTab === 'data' 
                        ? 'bg-black text-gray-200' 
                        : 'text-gray-500 hover:text-gray-300 hover:bg-[#161616]'
                    }`}
              >
                <FileJson className="h-3.5 w-3.5" />
                <span>data.json</span>
                {activeTab === 'data' && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500"
                    layoutId="activeTab"
                  />
                )}
              </button>
              <div className="flex-1"></div>
            </div>

            <div className="flex-1 relative">
              <AnimatePresence mode="wait">
                {activeTab === 'template' && (
                  <motion.div
                    key="template"
                    className="absolute inset-0"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="relative h-full">
                      <motion.div 
                        className="absolute top-2 right-2 z-10"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleImport('template')}
                          className="glassmorphic-button"
                          title="Import template file"
                        >
                          <Upload className="h-4 w-4" />
                        </Button>
                      </motion.div>
                      <Editor
                        height="100%"
                        defaultLanguage="handlebars"
                        value={template}
                        onChange={handleTemplateChange}
                        theme={isDarkTheme ? "vs-dark" : "light"}
                                                  options={{
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
                          }}
                      />
                    </div>
                  </motion.div>
                )}

                {activeTab === 'data' && (
                  <motion.div
                    key="data"
                    className="absolute inset-0"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="relative h-full">
                      <motion.div 
                        className="absolute top-2 right-2 z-10"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleImport('data')}
                          className="glassmorphic-button"
                          title="Import data file"
                        >
                          <Upload className="h-4 w-4" />
                        </Button>
                      </motion.div>
                      <Editor
                        height="100%"
                        defaultLanguage="json"
                        value={data}
                        onChange={handleDataChange}
                        theme={isDarkTheme ? "vs-dark" : "light"}
                                                  options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            fontWeight: '500',
                            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                            lineNumbers: 'on',
                            roundedSelection: false,
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            wordWrap: 'on',
                            formatOnPaste: true,
                            formatOnType: true,
                          }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Right Panel - HTML Preview */}
        <motion.div 
          className="h-full"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="h-full flex flex-col">
                          <div className="h-7 bg-[#0A0A0A] border-b border-[#333333] flex items-center px-3 justify-between">
                <div className="flex items-center space-x-1.5">
                  <div className="flex space-x-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F57] opacity-75"></div>
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E] opacity-75"></div>
                    <div className="w-3 h-3 rounded-full bg-[#28C840] opacity-75"></div>
                  </div>
                  <span className="text-xs text-gray-500">Preview</span>
                </div>
                {error && (
                  <div className="text-xs px-2 py-0.5 rounded bg-[#450A0A] border border-red-900/50 text-red-500">
                    Error
                  </div>
                )}
            </div>

                          <div className="flex-1 overflow-auto bg-white dark:bg-black">
                <AnimatePresence mode="wait">
                  {error ? (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4"
                    >
                      <div className="rounded-lg border border-red-900/50 bg-[#450A0A] p-4">
                        <div className="flex items-center space-x-2 text-red-500 text-sm mb-2">
                          <Code2 className="h-4 w-4" />
                          <span className="font-medium">Compilation Error</span>
                        </div>
                        <pre className="text-xs font-mono text-red-400/90 whitespace-pre-wrap">{error}</pre>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`prose max-w-none ${isDarkTheme ? 'prose-invert prose-pre:bg-[#161616] prose-pre:text-gray-300' : ''} p-4`}
                      dangerouslySetInnerHTML={{ __html: compiledHtml }}
                    />
                  )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
