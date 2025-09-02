import { StorageService, Template, StorageData } from './types'
import { supabase } from '../supabase/client'
import { logger } from '../utils/logger'

export class SupabaseService implements StorageService {
  // Template management - Supabase operations only
  async saveTemplates(templates: Template[], currentTemplateId: string): Promise<void> {
    try {
      // Check if Supabase client is available
      if (!supabase) {
        logger.warn('Supabase client not available, skipping save')
        return
      }

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
      
    } catch (error) {
      throw error
    }
  }

  async getTemplates(): Promise<{ templates: Template[], currentTemplateId: string } | null> {
    try {
      // Check if Supabase client is available
      if (!supabase) {
        logger.warn('Supabase client not available, returning null to indicate no storage')
        return null
      }

      // Add timeout to prevent hanging
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 5000) // 5 second timeout
      })

      // Get templates from Supabase with timeout
      const templatesPromise = supabase
        .from('templates')
        .select('*')
        .order('updated_at', { ascending: false })

      const { data, error } = await Promise.race([templatesPromise, timeoutPromise])

      if (error) {
        // Return null on error to indicate storage failure
        return null
      }

      // Convert Supabase data to Template format
      const templates: Template[] = (data || []).map(row => {
        // Try to parse the content as JSON to get the full template structure
        let templateData = {
          template: row.content || '',
          data: '{}',
          layout: '<div>{{{body}}}</div>',
          styles: ''
        }
        
        try {
          // If content is JSON, parse it to get the full template structure
          const parsedContent = JSON.parse(row.content || '{}')
          if (parsedContent.template || parsedContent.data || parsedContent.layout || parsedContent.styles) {
            templateData = {
              template: parsedContent.template || '',
              data: parsedContent.data || '{}',
              layout: parsedContent.layout || '<div>{{{body}}}</div>',
              styles: parsedContent.styles || ''
            }
          }
        } catch (e) {
          // If parsing fails, treat content as template directly
          templateData.template = row.content || ''
        }
        
        return {
          id: row.id,
          name: row.name,
          slug: row.name.toLowerCase().replace(/\s+/g, '-'),
          ...templateData,
          createdAt: new Date(row.created_at),
          updatedAt: new Date(row.updated_at)
        }
      })

      // For now, return the first template as current, or empty string if no templates
      const currentTemplateId = templates.length > 0 ? templates[0].id : ''

      return { templates, currentTemplateId }
    } catch (error) {
      // Return null on error to indicate storage failure
      return null
    }
  }

  async clearAll(): Promise<void> {
    try {
      // Check if Supabase client is available
      if (!supabase) {
        logger.warn('Supabase client not available, skipping clear')
        return
      }

      // Clear all templates
      await this.clearAllTemplates()
    } catch (error) {
      throw error
    }
  }

  // Bulk operations
  async saveAll(data: Partial<StorageData>): Promise<void> {
    if (data.templates && data.currentTemplateId !== undefined) {
      await this.saveTemplates(data.templates, data.currentTemplateId)
    }
  }

  async loadAll(): Promise<Partial<StorageData> | null> {
    const templatesData = await this.getTemplates()
    
    // If getTemplates returns null, it means there was an error or no data
    // Return null to indicate this to the caller
    if (!templatesData) {
      return null
    }
    
    return {
      templates: templatesData.templates,
      currentTemplateId: templatesData.currentTemplateId
    }
  }

  // Private helper methods
  private async saveTemplateToSupabase(template: Template): Promise<Template | null> {
    try {
      // Check if Supabase client is available
      if (!supabase) {
        logger.warn('Supabase client not available, skipping template save')
        return null
      }



      // First, check if a template with this name already exists
      const { data: existingTemplates, error: searchError } = await supabase
        .from('templates')
        .select('id, name')
        .eq('name', template.name)
        .limit(1)

      if (searchError) {
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
        }
      } else if (template.id.startsWith('temp-')) {
        // New template - let Supabase generate the ID
        templateId = undefined
      }

      // Store the full template structure as JSON
      const templateContent = JSON.stringify({
        template: template.template,
        data: template.data,
        layout: template.layout,
        styles: template.styles
      })

      const { data, error } = await supabase
        .from('templates')
        .upsert({
          ...(templateId && !templateId.startsWith('temp-') ? { id: templateId } : {}),
          name: template.name,
          content: templateContent, // Store full template structure as JSON
          description: template.description || `Template: ${template.name}`,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        })
        .select()

      if (error) {
        throw error
      }

      if (data && data.length > 0) {
        const savedRow = data[0]
        
        // Parse the stored content to get the full template structure
        let templateData = {
          template: savedRow.content || '',
          data: '{}',
          layout: '<div>{{{body}}}</div>',
          styles: ''
        }
        
        try {
          const parsedContent = JSON.parse(savedRow.content || '{}')
          if (parsedContent.template || parsedContent.data || parsedContent.layout || parsedContent.styles) {
            templateData = {
              template: parsedContent.template || '',
              data: parsedContent.data || '{}',
              layout: parsedContent.layout || '<div>{{{body}}}</div>',
              styles: parsedContent.styles || ''
            }
          }
        } catch (e) {
          // If parsing fails, treat content as template directly
          templateData.template = savedRow.content || ''
        }
        
        return {
          id: savedRow.id,
          name: savedRow.name,
          slug: savedRow.name.toLowerCase().replace(/\s+/g, '-'),
          ...templateData,
          description: savedRow.description,
          createdAt: new Date(savedRow.created_at),
          updatedAt: new Date(savedRow.updated_at)
        }
      }

      return null
    } catch (error) {
      throw error
    }
  }

  private async clearAllTemplates(): Promise<void> {
    if (!supabase) {
      return
    }

    const { error } = await supabase
      .from('templates')
      .delete()
      .neq('id', '') // Delete all records

    if (error) {
      throw error
    }
  }
}
