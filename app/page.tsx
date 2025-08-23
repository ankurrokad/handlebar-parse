'use client'

import { useState, useEffect } from 'react'
import { Code2, FileJson, Eye, Copy, Upload, Play, Square, Sun, Moon, Layout, Layers, RotateCcw, CheckCircle } from 'lucide-react'
import Editor from '@monaco-editor/react'
import Handlebars from 'handlebars'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'

import { Suspense } from 'react'
import { Loading } from '@/components/loading'

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

export default function Home() {
  const [activeTab, setActiveTab] = useState<'template' | 'data' | 'layout' | 'styles'>('layout')
  const [template, setTemplate] = useState(`<div class="container">
  <h2>{{title}}</h2>
  <p>{{description}}</p>
  
  {{#if showList}}
    <ul>
      {{#each items}}
        <li>{{name}} - {{price}}</li>
      {{/each}}
    </ul>
  {{/if}}
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
  
    const [layout, setLayout] = useState(`<!DOCTYPE html>
 <html lang="en">
 <head>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>{{title}}</title>
 </head>
 <body>
   <header class="header">
     <h1>{{title}}</h1>
   </header>
   
   <main class="content">
     {{{body}}}
   </main>
   
   <footer class="footer">
     <p>&copy; 2024 HBS Parser. Generated on {{formatDate date}}</p>
   </footer>
 </body>
 </html>`)
   
   const [styles, setStyles] = useState(`/* Custom Styles for Template */
 body {
   font-family: Arial, sans-serif;
   margin: 0;
   padding: 0;
 }
 
 .header {
   padding: 1rem;
   border-bottom: 1px solid #dee2e6;
 }
 
 .content {
   padding: 2rem;
   margin: 1rem;
   border-radius: 8px;
   box-shadow: 0 2px 4px rgba(0,0,0,0.1);
 }
 
 .footer {
   padding: 1rem;
   text-align: center;
   border-top: 1px solid #dee2e6;
   margin-top: 2rem;
 }
 
 .container {
   max-width: 1200px;
   margin: 0 auto;
 }
 
 h1, h2 {
   color: #333;
   margin-bottom: 1rem;
 }
 
 p {
   color: #666;
   line-height: 1.6;
 }
 
 ul {
   list-style: none;
   padding: 0;
 }
 
 li {
   padding: 0.5rem 0;
   border-bottom: 1px solid #eee;
 }
 
 li:last-child {
   border-bottom: none;
 }`)
  
  const [compiledHtml, setCompiledHtml] = useState('')
  const [error, setError] = useState('')
  const [isPlaying, setIsPlaying] = useState(true)
  const [isDarkTheme, setIsDarkTheme] = useState(true)
  const [useLayout, setUseLayout] = useState(true)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)


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

  // Compile template when template, data, layout, or styles changes
  useEffect(() => {
    if (!isPlaying) return
    
    try {
      const parsedData = JSON.parse(data)
      
      // First compile the main template
      const templateFn = Handlebars.compile(template)
      const templateResult = templateFn(parsedData)
      
      let result = templateResult
      
      // If layout is enabled, compile with layout
      if (useLayout) {
        const layoutData = { ...parsedData, body: templateResult }
        const layoutFn = Handlebars.compile(layout)
        result = layoutFn(layoutData)
      }
      
      // Inject custom styles into the result
      if (styles.trim()) {
        const styleTag = `<style>\n${styles}\n</style>`
        if (useLayout) {
          // Insert styles in the head section of layout
          result = result.replace('</head>', `${styleTag}\n</head>`)
        } else {
          // Insert styles at the beginning of the template result
          result = styleTag + '\n' + result
        }
      }
      
      setCompiledHtml(result)
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setCompiledHtml('')
    }
  }, [template, data, layout, styles, useLayout, isPlaying])

  const handleTemplateChange = (value: string | undefined) => {
    const newValue = value || ''
    setTemplate(newValue)
    saveToStorage('hbs-parser-template', newValue)
  }

  const handleDataChange = (value: string | undefined) => {
    const newValue = value || ''
    setData(newValue)
    saveToStorage('hbs-parser-data', newValue)
  }

  const handleLayoutChange = (value: string | undefined) => {
    const newValue = value || ''
    setLayout(newValue)
    saveToStorage('hbs-parser-layout', newValue)
  }
  
  const handleStylesChange = (value: string | undefined) => {
    const newValue = value || ''
    setStyles(newValue)
    saveToStorage('hbs-parser-styles', newValue)
  }

  // Auto-save to localStorage
  const saveToStorage = (key: string, value: string) => {
    try {
      localStorage.setItem(key, value)
      setLastSaved(new Date())
    } catch (err) {
      console.warn('Failed to save to localStorage:', err)
    }
  }

  // Save theme and layout preference
  const savePreferences = () => {
    try {
      localStorage.setItem('hbs-parser-theme', isDarkTheme ? 'dark' : 'light')
      localStorage.setItem('hbs-parser-useLayout', useLayout.toString())
    } catch (err) {
      console.warn('Failed to save preferences:', err)
    }
  }



  const handleCopyHtml = async () => {
    try {
      await navigator.clipboard.writeText(compiledHtml)
      // You could add a toast notification here if you want
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = compiledHtml
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    }
  }

  const handleImport = (type: 'template' | 'data' | 'layout' | 'styles') => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = type === 'template' ? '.hbs,.html,.txt' : 
                   type === 'data' ? '.json,.txt' : 
                   type === 'styles' ? '.css,.txt' : '.html,.hbs,.txt'
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const content = e.target?.result as string
          if (type === 'template') {
            setTemplate(content)
          } else if (type === 'data') {
            setData(content)
          } else if (type === 'styles') {
            setStyles(content)
          } else {
            setLayout(content)
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
    
    // Save theme preference
    savePreferences()
  }

  const toggleLayout = () => {
    const newUseLayout = !useLayout
    setUseLayout(newUseLayout)
    savePreferences()
  }

  const resetToDefaults = () => {
    if (confirm('Are you sure you want to reset all templates to defaults? This will clear your saved work.')) {
      // Reset to default values
      setTemplate(`<div class="container">
  <h2>{{title}}</h2>
  <p>{{description}}</p>
  
  {{#if showList}}
    <ul>
      {{#each items}}
        <li>{{name}} - {{price}}</li>
      {{/each}}
    </ul>
  {{/if}}
</div>`)
      
      setData(`{
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
      
      setLayout(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{title}}</title>
</head>
<body>
  <header class="header">
    <h1>{{title}}</h1>
  </header>
  
  <main class="content">
    {{{body}}}
  </main>
  
  <footer class="footer">
    <p>&copy; 2024 HBS Parser. Generated on {{formatDate date}}</p>
  </footer>
</body>
</html>`)
      
      setStyles(`/* Custom Styles for Template */
 body {
   font-family: Arial, sans-serif;
   margin: 0;
   padding: 0;
 }
 
 .header {
   padding: 1rem;
   border-bottom: 1px solid #dee2e6;
 }
 
 .content {
   padding: 2rem;
   margin: 1rem;
   border-radius: 8px;
   box-shadow: 0 2px 4px rgba(0,0,0,0.1);
 }
 
 .footer {
   padding: 1rem;
   text-align: center;
   border-top: 1px solid #dee2e6;
   margin-top: 2rem;
 }
 
 .container {
   max-width: 1200px;
   margin: 0 auto;
 }
 
 h1, h2 {
   color: #333;
   margin-bottom: 1rem;
 }
 
 p {
   color: #666;
   line-height: 1.6;
 }
 
 ul {
   list-style: none;
   padding: 0;
 }
 
 li {
   padding: 0.5rem 0;
   border-bottom: 1px solid #eee;
 }
 
 li:last-child {
   border-bottom: none;
 }`)
      
      // Clear localStorage
      try {
        localStorage.removeItem('hbs-parser-template')
        localStorage.removeItem('hbs-parser-data')
        localStorage.removeItem('hbs-parser-layout')
        localStorage.removeItem('hbs-parser-styles')
      } catch (err) {
        console.warn('Failed to clear localStorage:', err)
      }
    }
  }

  // Load saved data from localStorage on mount
  useEffect(() => {
    try {
      const savedTemplate = localStorage.getItem('hbs-parser-template')
      const savedData = localStorage.getItem('hbs-parser-data')
      const savedLayout = localStorage.getItem('hbs-parser-layout')
      const savedStyles = localStorage.getItem('hbs-parser-styles')
      const savedTheme = localStorage.getItem('hbs-parser-theme')
      const savedUseLayout = localStorage.getItem('hbs-parser-useLayout')
      
      if (savedTemplate) setTemplate(savedTemplate)
      if (savedData) setData(savedData)
      if (savedLayout) setLayout(savedLayout)
      if (savedStyles) setStyles(savedStyles)
      if (savedTheme) setIsDarkTheme(savedTheme === 'dark')
      if (savedUseLayout) setUseLayout(savedUseLayout === 'true')
      
      setLastSaved(new Date())
    } catch (err) {
      console.warn('Failed to load from localStorage:', err)
    }
  }, [])

  // Set initial theme on mount
  useEffect(() => {
    if (isDarkTheme) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])



  return (
    <Suspense fallback={<Loading />}>
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
      <header className="h-8 bg-[#0A0A0A] border-b border-[#333333] flex items-center justify-between px-2 select-none" style={{ height: '32px' }}>
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
            onClick={toggleLayout}
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
            onClick={toggleTheme}
            className="p-1 rounded text-gray-500 hover:bg-[#161616]"
            title="Toggle theme"
          >
            {isDarkTheme ? <Sun className="h-3 w-3" /> : <Moon className="h-3 w-3" />}
          </button>
          
          
          

          
          <button
            onClick={resetToDefaults}
            className="p-1 rounded text-gray-500 hover:bg-[#161616]"
            title="Reset to defaults"
          >
            <RotateCcw className="h-3 w-3" />
          </button>
        </div>
        

      </header>

      {/* Main Content - Full Width */}
      <div className="relative z-10 grid grid-cols-1 xl:grid-cols-2 divide-x divide-[#333333]" style={{ height: 'calc(100vh - 32px)' }}>
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
                 onClick={() => setActiveTab('layout')}
                 className={`flex items-center space-x-1.5 px-3 text-xs relative ${
                   activeTab === 'layout' 
                     ? 'bg-black text-gray-200' 
                     : 'text-gray-500 hover:text-gray-300 hover:bg-[#161616]'
                 }`}
               >
                 <Layout className="h-3.5 w-3.5" />
                 <span>layout.html</span>
                 {activeTab === 'layout' && (
                   <motion.div
                     className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500"
                     layoutId="activeTab"
                   />
                 )}
               </button>
               
               <button
                 onClick={() => setActiveTab('template')}
                 className={`flex items-center space-x-1.5 px-3 text-xs relative ${
                   activeTab === 'template' 
                     ? 'bg-black text-gray-200' 
                     : 'text-gray-500 hover:text-gray-300 hover:bg-[#161616]'
                 }`}
               >
                 <Code2 className="h-3.5 w-3.5" />
                 <span>body.hbs</span>
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
                
                <button
                  onClick={() => setActiveTab('styles')}
                  className={`flex items-center space-x-1.5 px-3 text-xs relative ${
                    activeTab === 'styles' 
                      ? 'bg-black text-gray-200' 
                      : 'text-gray-500 hover:text-gray-300 hover:bg-[#161616]'
                  }`}
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>styles.css</span>
                  {activeTab === 'styles' && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500"
                      layoutId="activeTab"
                    />
                  )}
                </button>
               
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
                   onClick={() => {
                     let contentToCopy = ''
                     if (activeTab === 'template') contentToCopy = template
                     else if (activeTab === 'data') contentToCopy = data
                     else if (activeTab === 'layout') contentToCopy = layout
                     else if (activeTab === 'styles') contentToCopy = styles
                     
                     if (contentToCopy) {
                       navigator.clipboard.writeText(contentToCopy)
                       // You could add a toast notification here
                     }
                   }}
                   className="p-1 rounded text-gray-500 hover:bg-[#161616] hover:text-gray-300 transition-colors"
                   title={`Copy ${activeTab === 'template' ? 'template' : activeTab === 'data' ? 'data' : activeTab === 'styles' ? 'styles' : 'layout'} content`}
                 >
                   <Copy className="h-3 w-3" />
                 </button>
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
                         onMount={handleEditorDidMount}
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
                           // Ensure keyboard shortcuts work properly
                           multiCursorModifier: 'alt',
                           accessibilitySupport: 'on',
                           // Enable all default shortcuts
                           quickSuggestions: true,
                           // Ensure Ctrl+A works
                           selectOnLineNumbers: true,
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
                         onMount={handleEditorDidMount}
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
                           // Ensure keyboard shortcuts work properly
                           multiCursorModifier: 'alt',
                           accessibilitySupport: 'on',
                           // Enable all default shortcuts
                           quickSuggestions: true,
                           // Ensure Ctrl+A works
                           selectOnLineNumbers: true,
                         }}
                       />
                    </div>
                  </motion.div>
                )}
                
                {activeTab === 'styles' && (
                  <motion.div
                    key="styles"
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
                          onClick={() => handleImport('styles')}
                          className="glassmorphic-button"
                          title="Import CSS file"
                        >
                          <Upload className="h-4 w-4" />
                        </Button>
                      </motion.div>
                      
                      <Editor
                        height="100%"
                        defaultLanguage="css"
                        value={styles}
                        onChange={handleStylesChange}
                        theme={isDarkTheme ? "vs-dark" : "light"}
                        onMount={handleEditorDidMount}
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
                          // Ensure keyboard shortcuts work properly
                          multiCursorModifier: 'alt',
                          accessibilitySupport: 'on',
                          // Enable all default shortcuts
                          quickSuggestions: true,
                          // Ensure Ctrl+A works
                          selectOnLineNumbers: true,
                        }}
                      />
                    </div>
                  </motion.div>
                )}

                {activeTab === 'layout' && (
                  <motion.div
                    key="layout"
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
                          onClick={() => handleImport('layout')}
                          className="glassmorphic-button"
                          title="Import layout file"
                        >
                          <Upload className="h-4 w-4" />
                        </Button>
                      </motion.div>
                                                                        <Editor
                             height="100%"
                             defaultLanguage="html"
                             value={layout}
                             onChange={handleLayoutChange}
                             theme={isDarkTheme ? "vs-dark" : "light"}
                             onMount={handleEditorDidMount}
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
                                   // Ensure keyboard shortcuts work properly
                                   multiCursorModifier: 'alt',
                                   accessibilitySupport: 'on',
                                   // Enable all default shortcuts
                                   quickSuggestions: true,
                                   // Ensure Ctrl+A works
                                   selectOnLineNumbers: true,
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
                 
                 <div className="flex items-center space-x-2">
                   {error && (
                     <div className="text-xs px-2 py-0.5 rounded bg-[#450A0A] border border-red-900/50 text-red-500">
                       Error
                     </div>
                   )}
                   
                   {/* Copy HTML Button */}
                   <button
                     onClick={handleCopyHtml}
                     className="p-1 rounded text-gray-500 hover:bg-[#161616] hover:text-gray-300 transition-colors"
                     title="Copy HTML to clipboard"
                   >
                     <Copy className="h-3 w-3" />
                   </button>
                 </div>
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
    </Suspense>
  )
}
