export interface Template {
  id: string
  name: string
  slug: string
  template: string
  data: string
  layout: string
  styles: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

export interface StorageData {
  templates: Template[]
  currentTemplateId: string
}

export interface StorageService {
  // Template management only
  saveTemplates(templates: Template[], currentTemplateId: string): Promise<void>
  getTemplates(): Promise<{ templates: Template[], currentTemplateId: string } | null>
  
  // Clear all data
  clearAll(): Promise<void>
  
  // Bulk operations
  saveAll(data: Partial<StorageData>): Promise<void>
  loadAll(): Promise<Partial<StorageData> | null>
}

export type StorageProvider = 'supabase'

export interface StorageConfig {
  provider: StorageProvider
  options?: Record<string, any>
}
