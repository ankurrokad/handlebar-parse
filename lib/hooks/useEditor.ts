import { useState, useEffect } from 'react'
import Handlebars from 'handlebars'
import { storageService } from '@/lib/storage'

export interface Template {
  id: string
  name: string
  slug: string
  template: string
  data: string
  layout: string
  styles: string
  createdAt: Date
  updatedAt: Date
}

export interface EditorState {
  templates: Template[]
  currentTemplateId: string
  compiledHtml: string
  error: string
  isPlaying: boolean
  useLayout: boolean
  lastSaved: Date | null
  isLoading: boolean
}

export const useEditor = () => {
  const [state, setState] = useState<EditorState>({
    templates: [
      {
        id: 'default',
        name: 'Default Template',
        slug: 'default-template',
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
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'email-template',
        name: 'Email Template',
        slug: 'email-template',
        template: `<div class="email-container">
  <div class="email-header">
    <h1>{{companyName}}</h1>
    <p class="tagline">{{tagline}}</p>
  </div>
  
  <div class="email-content">
    <h2>{{greeting}} {{customerName}},</h2>
    <p>{{message}}</p>
    
    {{#if hasOffer}}
      <div class="offer-box">
        <h3>Special Offer!</h3>
        <p>{{offerText}}</p>
        <a href="{{offerLink}}" class="cta-button">Claim Offer</a>
      </div>
    {{/if}}
    
    <p>Best regards,<br>{{senderName}}</p>
  </div>
  
  <div class="email-footer">
    <p>{{footerText}}</p>
    <a href="{{unsubscribeLink}}">Unsubscribe</a>
  </div>
</div>`,
        data: `{
  "companyName": "TechCorp Inc.",
  "tagline": "Innovation at its finest",
  "greeting": "Hello",
  "customerName": "John Doe",
  "message": "Thank you for your recent purchase. We hope you're enjoying your new product!",
  "hasOffer": true,
  "offerText": "Get 20% off your next order with code: SAVE20",
  "offerLink": "https://techcorp.com/offer",
  "senderName": "Sarah Johnson",
  "footerText": "This email was sent to you because you're a valued customer.",
  "unsubscribeLink": "https://techcorp.com/unsubscribe"
}`,
        layout: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{companyName}} - {{tagline}}</title>
</head>
<body>
  <div class="email-wrapper">
    {{{body}}}
  </div>
</body>
</html>`,
        styles: `/* Email Template Styles */
.email-wrapper {
  font-family: Arial, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  background-color: #f4f4f4;
  padding: 20px;
}

.email-container {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.email-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  text-align: center;
}

.email-header h1 {
  margin: 0;
  font-size: 28px;
  font-weight: bold;
}

.tagline {
  margin: 10px 0 0 0;
  font-size: 16px;
  opacity: 0.9;
}

.email-content {
  padding: 30px;
  line-height: 1.6;
}

.email-content h2 {
  color: #333;
  margin-bottom: 20px;
}

.offer-box {
  background-color: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 6px;
  padding: 20px;
  margin: 20px 0;
  text-align: center;
}

.offer-box h3 {
  color: #856404;
  margin: 0 0 10px 0;
}

.cta-button {
  display: inline-block;
  background-color: #28a745;
  color: white;
  padding: 12px 24px;
  text-decoration: none;
  border-radius: 6px;
  font-weight: bold;
  margin-top: 15px;
}

.cta-button:hover {
  background-color: #218838;
}

.email-footer {
  background-color: #f8f9fa;
  padding: 20px;
  text-align: center;
  border-top: 1px solid #dee2e6;
  color: #6c757d;
}

.email-footer a {
  color: #007bff;
  text-decoration: none;
}

.email-footer a:hover {
  text-decoration: underline;
}`,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'blog-post',
        name: 'Blog Post Template',
        slug: 'blog-post-template',
        template: `<article class="blog-post">
  <header class="post-header">
    <h1 class="post-title">{{title}}</h1>
    <div class="post-meta">
      <span class="post-date">{{formatDate publishDate}}</span>
      <span class="post-author">by {{author}}</span>
      <span class="post-category">{{category}}</span>
    </div>
  </header>
  
  <div class="post-content">
    <p class="post-excerpt">{{excerpt}}</p>
    
    {{#if featuredImage}}
      <img src="{{featuredImage}}" alt="{{title}}" class="featured-image">
    {{/if}}
    
    <div class="post-body">
      {{{content}}}
    </div>
    
    {{#if tags}}
      <div class="post-tags">
        {{#each tags}}
          <span class="tag">{{this}}</span>
        {{/each}}
      </div>
    {{/if}}
  </div>
  
  <footer class="post-footer">
    <div class="social-share">
      <h4>Share this post:</h4>
      <a href="#" class="share-btn twitter">Twitter</a>
      <a href="#" class="share-btn facebook">Facebook</a>
      <a href="#" class="share-btn linkedin">LinkedIn</a>
    </div>
  </footer>
</article>`,
        data: `{
  "title": "Getting Started with Handlebars Templates",
  "publishDate": "2024-01-15",
  "author": "Jane Smith",
  "category": "Web Development",
  "excerpt": "Learn how to create powerful and flexible templates using Handlebars.js for your web applications.",
  "featuredImage": "https://via.placeholder.com/800x400",
  "content": "<p>Handlebars is a powerful templating engine that makes it easy to create dynamic HTML content...</p><p>In this post, we'll explore the basics of Handlebars and how to use it effectively in your projects.</p>",
  "tags": ["Handlebars", "Templates", "JavaScript", "Web Development"]
}`,
        layout: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{title}} - My Blog</title>
</head>
<body>
  <div class="blog-container">
    {{{body}}}
  </div>
</body>
</html>`,
        styles: `/* Blog Post Styles */
.blog-container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: white;
}

.blog-post {
  line-height: 1.6;
}

.post-header {
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e9ecef;
}

.post-title {
  font-size: 2.5rem;
  color: #2c3e50;
  margin: 0 0 15px 0;
  line-height: 1.2;
}

.post-meta {
  color: #6c757d;
  font-size: 0.9rem;
}

.post-meta span {
  margin-right: 20px;
}

.post-meta span:last-child {
  margin-right: 0;
}

.post-content {
  margin-bottom: 40px;
}

.post-excerpt {
  font-size: 1.1rem;
  color: #495057;
  font-style: italic;
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border-left: 4px solid #007bff;
}

.featured-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 20px 0;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.post-body {
  font-size: 1.1rem;
  color: #212529;
}

.post-tags {
  margin: 30px 0;
}

.tag {
  display: inline-block;
  background-color: #e9ecef;
  color: #495057;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  margin-right: 10px;
  margin-bottom: 10px;
}

.post-footer {
  padding-top: 30px;
  border-top: 1px solid #e9ecef;
}

.social-share h4 {
  color: #495057;
  margin-bottom: 15px;
}

.share-btn {
  display: inline-block;
  padding: 8px 16px;
  margin-right: 10px;
  text-decoration: none;
  color: white;
  border-radius: 4px;
  font-size: 0.9rem;
}

.share-btn.twitter {
  background-color: #1da1f2;
}

.share-btn.facebook {
  background-color: #4267b2;
}

.share-btn.linkedin {
  background-color: #0077b5;
}

.share-btn:hover {
  opacity: 0.8;
}`,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    currentTemplateId: 'default',
    compiledHtml: '',
    error: '',
    isPlaying: true,
    useLayout: true,
    lastSaved: null,
    isLoading: true
  })

  // Get current template
  const getCurrentTemplate = () => {
    // During loading, return null to prevent compilation
    if (state.isLoading) {
      return null
    }
    
    // If no templates exist, return null
    if (state.templates.length === 0) {
      return null
    }
    
    // Find the current template by ID, fallback to first template
    const currentTemplate = state.templates.find(t => t.id === state.currentTemplateId)
    if (currentTemplate) {
      return currentTemplate
    }
    
    // If currentTemplateId doesn't exist, use the first template
    return state.templates[0]
  }

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
    // Don't compile if still loading or not playing
    if (state.isLoading || !state.isPlaying) {
      return
    }
    
    const currentTemplate = getCurrentTemplate()
    if (!currentTemplate) {
      return
    }
    
    try {
      const parsedData = JSON.parse(currentTemplate.data)
      
      // First compile the main template
      const templateFn = Handlebars.compile(currentTemplate.template)
      const templateResult = templateFn(parsedData)
      
      let result = templateResult
      
      // If layout is enabled, compile with layout
      if (state.useLayout) {
        const layoutData = { ...parsedData, body: templateResult }
        const layoutFn = Handlebars.compile(currentTemplate.layout)
        result = layoutFn(layoutData)
      }
      
      // Inject custom styles into the result
      if (currentTemplate.styles.trim()) {
        const styleTag = `<style>\n${currentTemplate.styles}\n</style>`
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
        error: err instanceof Error ? err.message : 'Template compilation failed',
        compiledHtml: ''
      }))
    }
  }, [state.templates, state.currentTemplateId, state.useLayout, state.isPlaying, state.isLoading])

  const updateField = (field: keyof Pick<Template, 'template' | 'data' | 'layout' | 'styles'>, value: string) => {
    const updatedTemplates = state.templates.map(t => 
      t.id === state.currentTemplateId 
        ? { ...t, [field]: value, updatedAt: new Date() }
        : t
    )
    setState(prev => ({
      ...prev,
      templates: updatedTemplates
    }))
    saveToStorage(updatedTemplates, state.currentTemplateId)
  }

  const switchTemplate = (templateId: string) => {
    setState(prev => ({ ...prev, currentTemplateId: templateId }))
  }

  const createTemplate = (name: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const newTemplate: Template = {
      id: crypto.randomUUID(),
      name,
      slug,
      template: `<div class="container">
  <h2>{{title}}</h2>
  <p>{{description}}</p>
</div>`,
      data: `{
  "title": "New Template",
  "description": "Template description"
}`,
      layout: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{title}}</title>
</head>
<body>
  <main class="content">
    {{{body}}}
  </main>
</body>
</html>`,
      styles: `/* Custom Styles */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h2 {
  color: #333;
  margin-bottom: 1rem;
}

p {
  color: #666;
  line-height: 1.6;
}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const newTemplates = [...state.templates, newTemplate]
    setState(prev => ({
      ...prev,
      templates: newTemplates,
      currentTemplateId: newTemplate.id
    }))
    saveToStorage(newTemplates, newTemplate.id)
  }

  const deleteTemplate = (templateId: string) => {
    if (state.templates.length <= 1) {
      alert('Cannot delete the last template. At least one template must remain.')
      return
    }

    if (confirm('Are you sure you want to delete this template? This action cannot be undone.')) {
      const newTemplates = state.templates.filter(t => t.id !== templateId)
      const newCurrentId = state.currentTemplateId === templateId 
        ? newTemplates[0].id 
        : state.currentTemplateId
      
      setState(prev => ({
        ...prev,
        templates: newTemplates,
        currentTemplateId: newCurrentId
      }))
      saveToStorage(newTemplates, newCurrentId)
    }
  }

  const renameTemplate = (templateId: string, newName: string) => {
    const newSlug = newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const updatedTemplates = state.templates.map(t => 
      t.id === templateId 
        ? { ...t, name: newName, slug: newSlug, updatedAt: new Date() }
        : t
    )
    setState(prev => ({
      ...prev,
      templates: updatedTemplates
    }))
    saveToStorage(updatedTemplates, state.currentTemplateId)
  }

  const importTemplate = async (file: File) => {
    try {
      const text = await file.text()
      const importedTemplate = JSON.parse(text, (key, value) => {
        if (key === 'createdAt' || key === 'updatedAt') {
          return new Date(value)
        }
        return value
      })
      
      // Validate the imported template
      if (!importedTemplate.name || !importedTemplate.slug || !importedTemplate.template) {
        throw new Error('Invalid template format')
      }
      
      // Generate a new ID and timestamps
      const newTemplate: Template = {
        ...importedTemplate,
        id: `template-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      setState(prev => ({
        ...prev,
        templates: [...prev.templates, newTemplate],
        currentTemplateId: newTemplate.id
      }))
      
      saveToStorage()
      return true
    } catch (err) {
      console.error('Failed to import template:', err)
      throw new Error(`Failed to import template: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  const exportTemplate = (template: Template) => {
    const dataStr = JSON.stringify(template, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${template.slug}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const toggleAutoPlay = () => {
    setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }))
  }

  const toggleLayout = () => {
    setState(prev => ({ ...prev, useLayout: !prev.useLayout }))
  }

  // Load data from Supabase on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Try to load data from Supabase with timeout
        const loadPromise = storageService.loadAll()
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Loading timeout')), 10000) // 10 second timeout
        )
        
        const data = await Promise.race([loadPromise, timeoutPromise]) as any
        
        if (data && data.templates && data.templates.length > 0) {
          setState(prev => ({
            ...prev,
            templates: data.templates,
            currentTemplateId: data.currentTemplateId || data.templates[0].id,
            isLoading: false,
            lastSaved: new Date()
          }))
        } else {
          setState(prev => ({
            ...prev,
            isLoading: false,
            currentTemplateId: 'default',
            lastSaved: new Date()
          }))
        }
      } catch (error) {
        // Fallback to default templates
        setState(prev => ({
          ...prev,
          isLoading: false,
          currentTemplateId: 'default',
          lastSaved: new Date()
        }))
      }
    }
    
    loadData()
  }, [])

  const resetToDefaults = async () => {
    if (confirm('Are you sure you want to reset all templates to defaults? This will clear your saved work.')) {
      const defaultTemplate: Template = {
        id: 'default',
        name: 'Default Template',
        slug: 'default-template',
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
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      setState(prev => ({
        ...prev,
        templates: [defaultTemplate],
        currentTemplateId: 'default'
      }))
      
      // Clear storage
      try {
        await storageService.clearAll()
      } catch (err) {
        // Silently handle storage errors in production
      }
    }
  }

  // Auto-save to storage
  const saveToStorage = async (templates = state.templates, currentId = state.currentTemplateId) => {
    try {
      await storageService.saveTemplates(templates, currentId)
      setState(prev => ({ ...prev, lastSaved: new Date() }))
    } catch (err) {
      // Silently handle storage errors in production
      console.error('Failed to save templates:', err)
    }
  }

  const currentTemplate = getCurrentTemplate()

  return {
    ...state,
    currentTemplate,
    updateField,
    switchTemplate,
    createTemplate,
    deleteTemplate,
    renameTemplate,
    importTemplate,
    exportTemplate,
    toggleAutoPlay,
    toggleLayout,
    resetToDefaults
  }
}
