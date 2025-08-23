import { StorageService, StorageProvider, StorageConfig, Template } from './types'
import { LocalStorageService } from './localStorageService'
import { IndexedDBService } from './indexedDBService'

export class StorageServiceManager {
  private static instance: StorageServiceManager
  private currentService: StorageService
  private config: StorageConfig

  private constructor() {
    // Default to localStorage
    this.config = { provider: 'localStorage' }
    this.currentService = new LocalStorageService()
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

  // Switch storage provider
  async switchProvider(provider: StorageProvider, options?: Record<string, any>): Promise<void> {
    if (provider === this.config.provider) {
      return // Already using this provider
    }

    try {
      let newService: StorageService

      switch (provider) {
        case 'localStorage':
          newService = new LocalStorageService()
          break
        case 'indexedDB':
          newService = new IndexedDBService()
          break
        case 'mongodb':
          // TODO: Implement MongoDB service
          throw new Error('MongoDB storage not yet implemented')
        case 'supabase':
          // TODO: Implement Supabase service
          throw new Error('Supabase storage not yet implemented')
        case 'custom':
          // TODO: Allow custom storage service injection
          throw new Error('Custom storage not yet implemented')
        default:
          throw new Error(`Unknown storage provider: ${provider}`)
      }

      // Migrate data from old service to new service
      await this.migrateData(this.currentService, newService)

      // Update the current service
      this.currentService = newService
      this.config = { provider, options }

      console.log(`Switched to ${provider} storage provider`)
    } catch (error) {
      console.error(`Failed to switch to ${provider} storage:`, error)
      throw error
    }
  }

  // Get current provider
  getCurrentProvider(): StorageProvider {
    return this.config.provider
  }

  // Get current config
  getConfig(): StorageConfig {
    return { ...this.config }
  }

  // Migrate data between storage services
  private async migrateData(fromService: StorageService, toService: StorageService): Promise<void> {
    try {
      const data = await fromService.loadAll()
      if (Object.keys(data).length > 0) {
        await toService.saveAll(data)
        console.log('Data migrated successfully')
      }
    } catch (error) {
      console.warn('Failed to migrate data:', error)
      // Don't throw here - we want to continue with the new service even if migration fails
    }
  }

  // Convenience methods that delegate to the current service
  async saveFile(key: string, value: string): Promise<void> {
    return this.currentService.saveFile(key, value)
  }

  async getFile(key: string): Promise<string | null> {
    return this.currentService.getFile(key)
  }

  async deleteFile(key: string): Promise<void> {
    return this.currentService.deleteFile(key)
  }

  async clearAll(): Promise<void> {
    return this.currentService.clearAll()
  }

  // Template management methods
  async saveTemplates(templates: Template[], currentTemplateId: string): Promise<void> {
    return this.currentService.saveTemplates(templates, currentTemplateId)
  }

  async getTemplates(): Promise<{ templates: Template[], currentTemplateId: string } | null> {
    return this.currentService.getTemplates()
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

  async saveAll(data: any): Promise<void> {
    return this.currentService.saveAll(data)
  }

  async loadAll(): Promise<any> {
    return this.currentService.loadAll()
  }
}

// Export a singleton instance
export const storageService = StorageServiceManager.getInstance()
