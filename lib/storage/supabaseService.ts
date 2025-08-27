import { StorageService, Template, StorageData } from './types'
import { supabase } from '../supabase/client'
import { logger } from '../utils/logger'

export class SupabaseService implements StorageService {
  private readonly TEMPLATES_KEY = 'templates'
  private readonly CURRENT_TEMPLATE_KEY = 'currentTemplateId'
  private readonly USE_LAYOUT_KEY = 'useLayout'
  private readonly THEME_KEY = 'theme'
  private readonly LAST_SAVED_KEY = 'lastSaved'

  // Core storage operations - using localStorage as fallback for non-template data
  async saveFile(key: string, value: string): Promise<void> {
    if (key === this.TEMPLATES_KEY) {
      // Templates are stored in Supabase, not in localStorage
      return
    }
    localStorage.setItem(key, value)
  }

  async getFile(key: string): Promise<string | null> {
    if (key === this.TEMPLATES_KEY) {
      // Templates are retrieved from Supabase
      return null
    }
    return localStorage.getItem(key)
  }

  async deleteFile(key: string): Promise<void> {
    if (key === this.TEMPLATES_KEY) {
      // Clear all templates from Supabase
      await this.clearAllTemplates()
      return
    }
    localStorage.removeItem(key)
  }

  async clearAll(): Promise<void> {
    await this.clearAllTemplates()
    localStorage.clear()
  }

  // Template management - Supabase operations
  async saveTemplates(templates: Template[], currentTemplateId: string): Promise<void> {
    try {
      // Save current template ID to localStorage for quick access
      localStorage.setItem(this.CURRENT_TEMPLATE_KEY, currentTemplateId)
      
      // Save each template to Supabase and get back the actual IDs
      const updatedTemplates: Template[] = []
      for (const template of templates) {
        const savedTemplate = await this.saveTemplateToSupabase(template)
        if (savedTemplate) {
          updatedTemplates.push(savedTemplate)
        } else {
          updatedTemplates.push(template)
        }
      }
      
      // Update last saved timestamp
      localStorage.setItem(this.LAST_SAVED_KEY, new Date().toISOString())
    } catch (error) {
      logger.error('Failed to save templates to Supabase:', error)
      throw error
    }
  }

  async getTemplates(): Promise<{ templates: Template[], currentTemplateId: string } | null> {
    try {
      // Get templates from Supabase
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) {
        logger.error('Error fetching templates:', error)
        return null
      }

      // Convert Supabase data to Template format
      const templates: Template[] = data.map(row => ({
        id: row.id,
        name: row.name,
        slug: row.name.toLowerCase().replace(/\s+/g, '-'), // Generate slug from name
        template: row.content, // Map content to template
        data: '{}', // Default empty data
        layout: '<div>{{{body}}}</div>', // Default layout
        styles: '', // Default empty styles
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at)
      }))

      // Get current template ID from localStorage
      const currentTemplateId = localStorage.getItem(this.CURRENT_TEMPLATE_KEY) || ''

      return { templates, currentTemplateId }
    } catch (error) {
      logger.error('Failed to get templates from Supabase:', error)
      return null
    }
  }

  // Legacy methods - redirect to Supabase where appropriate
  async saveTemplate(template: string): Promise<void> {
    // This method is legacy - templates should be saved with full Template object
    console.warn('saveTemplate() is deprecated. Use saveTemplates() instead.')
  }

  async getTemplate(): Promise<string | null> {
    // This method is legacy - templates should be retrieved with getTemplates()
    console.warn('getTemplate() is deprecated. Use getTemplates() instead.')
    return null
  }

  async saveData(data: string): Promise<void> {
    localStorage.setItem('data', data)
  }

  async getData(): Promise<string | null> {
    return localStorage.getItem('data')
  }

  async saveLayout(layout: string): Promise<void> {
    localStorage.setItem('layout', layout)
  }

  async getLayout(): Promise<string | null> {
    return localStorage.getItem('layout')
  }

  async saveStyles(styles: string): Promise<void> {
    localStorage.setItem('styles', styles)
  }

  async getStyles(): Promise<string | null> {
    return localStorage.getItem('styles')
  }

  async savePreferences(useLayout: boolean): Promise<void> {
    localStorage.setItem(this.USE_LAYOUT_KEY, JSON.stringify(useLayout))
  }

  async getPreferences(): Promise<{ useLayout: boolean } | null> {
    const value = localStorage.getItem(this.USE_LAYOUT_KEY)
    return value ? { useLayout: JSON.parse(value) } : null
  }

  async saveTheme(theme: 'dark' | 'light'): Promise<void> {
    localStorage.setItem(this.THEME_KEY, theme)
  }

  async getTheme(): Promise<'dark' | 'light' | null> {
    return localStorage.getItem(this.THEME_KEY) as 'dark' | 'light' | null
  }

  // Bulk operations
  async saveAll(data: Partial<StorageData>): Promise<void> {
    if (data.templates && data.currentTemplateId !== undefined) {
      await this.saveTemplates(data.templates, data.currentTemplateId)
    }
    
    if (data.useLayout !== undefined) {
      await this.savePreferences(data.useLayout)
    }
    
    if (data.theme) {
      await this.saveTheme(data.theme)
    }
    
    if (data.lastSaved) {
      localStorage.setItem(this.LAST_SAVED_KEY, data.lastSaved.toISOString())
    }
  }

  async loadAll(): Promise<Partial<StorageData>> {
    const templatesData = await this.getTemplates()
    const preferences = await this.getPreferences()
    const theme = await this.getTheme()
    const lastSavedStr = localStorage.getItem(this.LAST_SAVED_KEY)
    
    return {
      templates: templatesData?.templates || [],
      currentTemplateId: templatesData?.currentTemplateId || '',
      useLayout: preferences?.useLayout || false,
      theme: theme || 'dark',
      lastSaved: lastSavedStr ? new Date(lastSavedStr) : null
    }
  }

  // Private helper methods
  private async saveTemplateToSupabase(template: Template): Promise<Template | null> {
    try {
      logger.log('Attempting to save template:', {
        name: template.name,
        hasId: !template.id.startsWith('temp-'),
        contentLength: template.template.length
      })

      // First, check if a template with this name already exists
      const { data: existingTemplates, error: searchError } = await supabase
        .from('templates')
        .select('id, name')
        .eq('name', template.name)
        .limit(1)

      if (searchError) {
        logger.error('Error searching for existing template:', searchError)
        throw searchError
      }

      let templateId: string | undefined = template.id
      let isUpdate = false

      // If template exists and we have a temporary ID, use the existing ID
      if (existingTemplates && existingTemplates.length > 0) {
        const existing = existingTemplates[0]
        if (template.id.startsWith('temp-')) {
          templateId = existing.id
          isUpdate = true
          logger.log(`🔄 Updating existing template: ${template.name} (ID: ${templateId})`)
        } else if (template.id !== existing.id) {
          // Different ID but same name - this shouldn't happen, but let's handle it
          logger.warn(`⚠️ Template name conflict: ${template.name}`)
        }
      } else if (template.id.startsWith('temp-')) {
        // New template - let Supabase generate the ID
        templateId = undefined
                  logger.log(`🆕 Creating new template: ${template.name}`)
      }

      logger.log(`📝 Final upsert data:`, {
        id: templateId,
        name: template.name,
        isUpdate,
        operation: isUpdate ? 'UPDATE' : 'INSERT'
      })

      const { data, error } = await supabase
        .from('templates')
        .upsert({
          ...(templateId && !templateId.startsWith('temp-') ? { id: templateId } : {}),
          name: template.name,
          content: template.template, // Map template to content
          description: template.description || `Template: ${template.name}`, // Use description or generate one
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        })
        .select()

      if (error) {
        logger.error('Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw error
      }

      if (data && data.length > 0) {
        const savedRow = data[0]
        return {
          id: savedRow.id,
          name: savedRow.name,
          slug: savedRow.name.toLowerCase().replace(/\s+/g, '-'),
          template: savedRow.content,
          data: '{}',
          layout: '<div>{{{body}}}</div>',
          styles: '',
          description: savedRow.description,
          createdAt: new Date(savedRow.created_at),
          updatedAt: new Date(savedRow.updated_at)
        }
      }

      return null
    } catch (error) {
      logger.error('Unexpected error in saveTemplateToSupabase:', error)
      throw error
    }
  }

  private async clearAllTemplates(): Promise<void> {
    const { error } = await supabase
      .from('templates')
      .delete()
      .neq('id', '') // Delete all records

    if (error) {
      logger.error('Error clearing templates from Supabase:', error)
      throw error
    }
  }
}
