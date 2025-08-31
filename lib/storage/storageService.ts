import { StorageService, StorageProvider, StorageConfig, Template } from './types'
import { SupabaseService } from './supabaseService'
import { logger } from '../utils/logger'

export class StorageServiceManager {
  private static instance: StorageServiceManager
  private currentService: StorageService
  private config: StorageConfig

  private constructor() {
    // Default to Supabase only
    this.config = { provider: 'supabase' }
    this.currentService = new SupabaseService()
  }

  static getInstance(): StorageServiceManager {
    if (!StorageServiceManager.instance) {
      StorageServiceManager.instance = new StorageServiceManager()
    }
    return StorageServiceManager.instance
  }

  // Get the current storage service
  getService(): StorageService {
    return this.currentService
  }

  // Get current provider (always Supabase)
  getCurrentProvider(): StorageProvider {
    return this.config.provider
  }

  // Get current config
  getConfig(): StorageConfig {
    return { ...this.config }
  }

  // Migrate data between storage services (simplified for Supabase only)
  private async migrateData(fromService: StorageService, toService: StorageService): Promise<void> {
    try {
      // Load all data from the source service
      const allData = await fromService.loadAll()
      
      if (allData) {
        // Save all data to the destination service
        await toService.saveAll(allData)
        logger.log('Data migration completed successfully')
      }
    } catch (error) {
      logger.error('Data migration failed:', error)
      throw new Error('Failed to migrate data between storage services')
    }
  }

  // Clear all data
  async clearAll(): Promise<void> {
    try {
      await this.currentService.clearAll()
      logger.log('All data cleared successfully')
    } catch (error) {
      logger.error('Failed to clear data:', error)
      throw error
    }
  }

  // Convenience methods for direct access to current service
  async saveFile(key: string, value: string): Promise<void> {
    return this.currentService.saveFile(key, value)
  }

  async getFile(key: string): Promise<string | null> {
    return this.currentService.getFile(key)
  }

  async deleteFile(key: string): Promise<void> {
    return this.currentService.deleteFile(key)
  }

  async saveTemplate(template: string): Promise<void> {
    return this.currentService.saveTemplate(template)
  }

  async getTemplate(): Promise<string | null> {
    return this.currentService.getTemplate()
  }

  async saveData(data: string): Promise<void> {
    return this.currentService.saveData(data)
  }

  async getData(): Promise<string | null> {
    return this.currentService.getData()
  }

  async saveLayout(layout: string): Promise<void> {
    return this.currentService.saveLayout(layout)
  }

  async getLayout(): Promise<string | null> {
    return this.currentService.getLayout()
  }

  async saveStyles(styles: string): Promise<void> {
    return this.currentService.saveStyles(styles)
  }

  async getStyles(): Promise<string | null> {
    return this.currentService.getStyles()
  }

  async savePreferences(useLayout: boolean): Promise<void> {
    return this.currentService.savePreferences(useLayout)
  }

  async getPreferences(): Promise<{ useLayout: boolean } | null> {
    return this.currentService.getPreferences()
  }

  async saveTheme(theme: 'dark' | 'light'): Promise<void> {
    return this.currentService.saveTheme(theme)
  }

  async getTheme(): Promise<'dark' | 'light' | null> {
    return this.currentService.getTheme()
  }

  async saveTemplates(templates: Template[], currentTemplateId: string): Promise<void> {
    return this.currentService.saveTemplates(templates, currentTemplateId)
  }

  async getTemplates(): Promise<{ templates: Template[], currentTemplateId: string } | null> {
    return this.currentService.getTemplates()
  }

  async saveAll(data: Partial<any>): Promise<void> {
    return this.currentService.saveAll(data)
  }

  async loadAll(): Promise<Partial<any>> {
    return this.currentService.loadAll()
  }
}

// Export singleton instance
export const storageService = StorageServiceManager.getInstance()

