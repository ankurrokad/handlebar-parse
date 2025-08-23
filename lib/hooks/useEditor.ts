import { useState, useEffect } from 'react'
import Handlebars from 'handlebars'

export interface EditorState {
  template: string
  data: string
  layout: string
  styles: string
  compiledHtml: string
  error: string
  isPlaying: boolean
  useLayout: boolean
  lastSaved: Date | null
}

export const useEditor = () => {
  const [state, setState] = useState<EditorState>({
    template: `<div class="container">
  <h2>{{title}}</h2>
  <p>{{description}}</p>
  
  {{#if showList}}
    <ul>
      {{#each items}}
        <li>{{name}} - {{price}}</li>
      {{/each}}
    </ul>
  {{/if}}
</div>`,
    data: `{
  "title": "Welcome to HBS Parser",
  "description": "A powerful tool for Handlebars template development",
  "showList": true,
  "items": [
    {"name": "Feature 1", "price": "$9.99"},
    {"name": "Feature 2", "price": "$19.99"},
    {"name": "Feature 3", "price": "$29.99"}
  ],
  "date": "2024-01-15"
}`,
    layout: `<!DOCTYPE html>
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
</html>`,
    styles: `/* Custom Styles for Template */
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
 }`,
    compiledHtml: '',
    error: '',
    isPlaying: true,
    useLayout: true,
    lastSaved: null
  })

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
    if (!state.isPlaying) return
    
    try {
      const parsedData = JSON.parse(state.data)
      
      // First compile the main template
      const templateFn = Handlebars.compile(state.template)
      const templateResult = templateFn(parsedData)
      
      let result = templateResult
      
      // If layout is enabled, compile with layout
      if (state.useLayout) {
        const layoutData = { ...parsedData, body: templateResult }
        const layoutFn = Handlebars.compile(state.layout)
        result = layoutFn(layoutData)
      }
      
      // Inject custom styles into the result
      if (state.styles.trim()) {
        const styleTag = `<style>\n${state.styles}\n</style>`
        if (state.useLayout) {
          // Insert styles in the head section of layout
          result = result.replace('</head>', `${styleTag}\n</head>`)
        } else {
          // Insert styles at the beginning of the template result
          result = styleTag + '\n' + result
        }
      }
      
      setState(prev => ({
        ...prev,
        compiledHtml: result,
        error: ''
      }))
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Unknown error',
        compiledHtml: ''
      }))
    }
  }, [state.template, state.data, state.layout, state.styles, state.useLayout, state.isPlaying])

  const updateField = (field: keyof Pick<EditorState, 'template' | 'data' | 'layout' | 'styles'>, value: string) => {
    setState(prev => ({ ...prev, [field]: value }))
    saveToStorage(`hbs-parser-${field}`, value)
  }

  const toggleAutoPlay = () => {
    setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }))
  }

  const toggleLayout = () => {
    setState(prev => ({ ...prev, useLayout: !prev.useLayout }))
    savePreferences()
  }

  // Load saved data from localStorage on mount
  useEffect(() => {
    try {
      const savedTemplate = localStorage.getItem('hbs-parser-template')
      const savedData = localStorage.getItem('hbs-parser-data')
      const savedLayout = localStorage.getItem('hbs-parser-layout')
      const savedStyles = localStorage.getItem('hbs-parser-styles')
      const savedUseLayout = localStorage.getItem('hbs-parser-useLayout')
      
      if (savedTemplate) setState(prev => ({ ...prev, template: savedTemplate }))
      if (savedData) setState(prev => ({ ...prev, data: savedData }))
      if (savedLayout) setState(prev => ({ ...prev, layout: savedLayout }))
      if (savedStyles) setState(prev => ({ ...prev, styles: savedStyles }))
      if (savedUseLayout) setState(prev => ({ ...prev, useLayout: savedUseLayout === 'true' }))
      
      setState(prev => ({ ...prev, lastSaved: new Date() }))
    } catch (err) {
      console.warn('Failed to load from localStorage:', err)
    }
  }, [])

  const resetToDefaults = () => {
    if (confirm('Are you sure you want to reset all templates to defaults? This will clear your saved work.')) {
      const defaultState: EditorState = {
        template: `<div class="container">
  <h2>{{title}}</h2>
  <p>{{description}}</p>
  
  {{#if showList}}
    <ul>
      {{#each items}}
        <li>{{name}} - {{price}}</li>
      {{/each}}
    </ul>
  {{/if}}
</div>`,
        data: `{
  "title": "Welcome to HBS Parser",
  "description": "A powerful tool for Handlebars template development",
  "showList": true,
  "items": [
    {"name": "Feature 1", "price": "$9.99"},
    {"name": "Feature 2", "price": "$19.99"},
    {"name": "Feature 3", "price": "$29.99"}
  ],
  "date": "2024-01-15"
}`,
        layout: `<!DOCTYPE html>
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
</html>`,
        styles: `/* Custom Styles for Template */
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
 }`,
        compiledHtml: '',
        error: '',
        isPlaying: true,
        useLayout: true,
        lastSaved: new Date()
      }
      
      setState(defaultState)
      
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

  // Auto-save to localStorage
  const saveToStorage = (key: string, value: string) => {
    try {
      localStorage.setItem(key, value)
      setState(prev => ({ ...prev, lastSaved: new Date() }))
    } catch (err) {
      console.warn('Failed to save to localStorage:', err)
    }
  }

  // Save theme and layout preference
  const savePreferences = () => {
    try {
      localStorage.setItem('hbs-parser-useLayout', state.useLayout.toString())
    } catch (err) {
      console.warn('Failed to save preferences:', err)
    }
  }

  return {
    ...state,
    updateField,
    toggleAutoPlay,
    toggleLayout,
    resetToDefaults
  }
}
