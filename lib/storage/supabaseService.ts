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
      
      logger.log('Templates saved successfully to Supabase')
    } catch (error) {
      logger.error('Failed to save templates to Supabase:', error)
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
        logger.error('Error fetching templates:', error)
        // Return null on error to indicate storage failure
        return null
      }

      // Convert Supabase data to Template format
      const templates: Template[] = (data || []).map(row => ({
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

      // For now, return the first template as current, or empty string if no templates
      const currentTemplateId = templates.length > 0 ? templates[0].id : ''

      return { templates, currentTemplateId }
    } catch (error) {
      logger.error('Failed to get templates from Supabase:', error)
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
      
      logger.log('All templates cleared successfully from Supabase')
    } catch (error) {
      logger.error('Failed to clear all data:', error)
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
    if (!supabase) {
      logger.warn('Supabase client not available, skipping template clear')
      return
    }

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
