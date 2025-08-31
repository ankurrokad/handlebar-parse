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
  useLayout: boolean
  theme: 'dark' | 'light'
  lastSaved: Date | null
}

export interface StorageService {
  // Core storage operations
  saveFile(key: string, value: string): Promise<void>
  getFile(key: string): Promise<string | null>
  deleteFile(key: string): Promise<void>
  clearAll(): Promise<void>
  
  // Template management
  saveTemplates(templates: Template[], currentTemplateId: string): Promise<void>
  getTemplates(): Promise<{ templates: Template[], currentTemplateId: string } | null>
  
  // Legacy methods for backward compatibility
  saveTemplate(template: string): Promise<void>
  getTemplate(): Promise<string | null>
  
  saveData(data: string): Promise<void>
  getData(): Promise<string | null>
  
  saveLayout(layout: string): Promise<void>
  getLayout(): Promise<string | null>
  
  saveStyles(styles: string): Promise<void>
  getStyles(): Promise<string | null>
  
  savePreferences(useLayout: boolean): Promise<void>
  getPreferences(): Promise<{ useLayout: boolean } | null>
  
  saveTheme(theme: 'dark' | 'light'): Promise<void>
  getTheme(): Promise<'dark' | 'light' | null>
  
  // Bulk operations
  saveAll(data: Partial<StorageData>): Promise<void>
  loadAll(): Promise<Partial<StorageData>>
}

export type StorageProvider = 'supabase'

export interface StorageConfig {
  provider: StorageProvider
  options?: Record<string, any>
}
