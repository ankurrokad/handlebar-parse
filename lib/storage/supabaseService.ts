import { StorageService, Template, StorageData } from './types'
import { supabase } from '../supabase/client'
import { logger } from '../utils/logger'

export class SupabaseService implements StorageService {
  private readonly TEMPLATES_KEY = 'templates'
  private readonly CURRENT_TEMPLATE_KEY = 'currentTemplateId'
  private readonly USE_LAYOUT_KEY = 'useLayout'
  private readonly THEME_KEY = 'theme'
  private readonly LAST_SAVED_KEY = 'lastSaved'
  private readonly DATA_KEY = 'data'
  private readonly LAYOUT_KEY = 'layout'
  private readonly STYLES_KEY = 'styles'

  // Core storage operations - all data stored in Supabase
  async saveFile(key: string, value: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('app_data')
        .upsert({
          key,
          value,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'key'
        })

      if (error) {
        logger.error('Failed to save file to Supabase:', error)
        throw error
      }
    } catch (error) {
      logger.error('Failed to save file:', error)
      throw error
    }
  }

  async getFile(key: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('app_data')
        .select('value')
        .eq('key', key)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned - key doesn't exist
          return null
        }
        logger.error('Failed to get file from Supabase:', error)
        throw error
      }

      return data?.value || null
    } catch (error) {
      logger.error('Failed to get file:', error)
      return null
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('app_data')
        .delete()
        .eq('key', key)

      if (error) {
        logger.error('Failed to delete file from Supabase:', error)
        throw error
      }
    } catch (error) {
      logger.error('Failed to delete file:', error)
      throw error
    }
  }

  async clearAll(): Promise<void> {
    try {
      // Clear all app data
      const { error: appDataError } = await supabase
        .from('app_data')
        .delete()
        .neq('key', '')

      if (appDataError) {
        logger.error('Failed to clear app data from Supabase:', appDataError)
        throw appDataError
      }

      // Clear all templates
      await this.clearAllTemplates()
      
      logger.log('All data cleared successfully from Supabase')
    } catch (error) {
      logger.error('Failed to clear all data:', error)
      throw error
    }
  }

  // Template management - Supabase operations
  async saveTemplates(templates: Template[], currentTemplateId: string): Promise<void> {
    try {
      // Save current template ID to Supabase
      await this.saveFile(this.CURRENT_TEMPLATE_KEY, currentTemplateId)
      
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
      await this.saveFile(this.LAST_SAVED_KEY, new Date().toISOString())
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

      // Get current template ID from Supabase
      const currentTemplateId = await this.getFile(this.CURRENT_TEMPLATE_KEY) || ''

      return { templates, currentTemplateId }
    } catch (error) {
      logger.error('Failed to get templates from Supabase:', error)
      return null
    }
  }

  // Legacy methods - now use Supabase
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
    await this.saveFile(this.DATA_KEY, data)
  }

  async getData(): Promise<string | null> {
    return await this.getFile(this.DATA_KEY)
  }

  async saveLayout(layout: string): Promise<void> {
    await this.saveFile(this.LAYOUT_KEY, layout)
  }

  async getLayout(): Promise<string | null> {
    return await this.getFile(this.LAYOUT_KEY)
  }

  async saveStyles(styles: string): Promise<void> {
    await this.saveFile(this.STYLES_KEY, styles)
  }

  async getStyles(): Promise<string | null> {
    return await this.getFile(this.STYLES_KEY)
  }

  async savePreferences(useLayout: boolean): Promise<void> {
    await this.saveFile(this.USE_LAYOUT_KEY, JSON.stringify(useLayout))
  }

  async getPreferences(): Promise<{ useLayout: boolean } | null> {
    const value = await this.getFile(this.USE_LAYOUT_KEY)
    return value ? { useLayout: JSON.parse(value) } : null
  }

  async saveTheme(theme: 'dark' | 'light'): Promise<void> {
    await this.saveFile(this.THEME_KEY, theme)
  }

  async getTheme(): Promise<'dark' | 'light' | null> {
    const value = await this.getFile(this.THEME_KEY)
    return value as 'dark' | 'light' | null
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
      await this.saveFile(this.LAST_SAVED_KEY, data.lastSaved.toISOString())
    }
  }

  async loadAll(): Promise<Partial<StorageData>> {
    const templatesData = await this.getTemplates()
    const preferences = await this.getPreferences()
    const theme = await this.getTheme()
    const lastSavedStr = await this.getFile(this.LAST_SAVED_KEY)
    
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
