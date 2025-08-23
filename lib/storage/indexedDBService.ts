import { StorageService, Template } from './types'

export class IndexedDBService implements StorageService {
  private dbName = 'hbs-parser-db'
  private version = 1
  private storeName = 'files'
  private db: IDBDatabase | null = null

  private async getDB(): Promise<IDBDatabase> {
    if (this.db) return this.db

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve(request.result)
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'key' })
        }
      }
    })
  }

  async saveFile(key: string, value: string): Promise<void> {
    try {
      const db = await this.getDB()
      const transaction = db.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      
      await new Promise<void>((resolve, reject) => {
        const request = store.put({ key, value })
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })
    } catch (err) {
      console.warn('Failed to save to IndexedDB:', err)
      throw new Error(`Failed to save ${key}: ${err}`)
    }
  }

  async getFile(key: string): Promise<string | null> {
    try {
      const db = await this.getDB()
      const transaction = db.transaction([this.storeName], 'readonly')
      const store = transaction.objectStore(this.storeName)
      
      return new Promise((resolve, reject) => {
        const request = store.get(key)
        request.onsuccess = () => {
          const result = request.result
          resolve(result ? result.value : null)
        }
        request.onerror = () => reject(request.error)
      })
    } catch (err) {
      console.warn('Failed to read from IndexedDB:', err)
      return null
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      const db = await this.getDB()
      const transaction = db.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      
      await new Promise<void>((resolve, reject) => {
        const request = store.delete(key)
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })
    } catch (err) {
      console.warn('Failed to delete from IndexedDB:', err)
      throw new Error(`Failed to delete ${key}: ${err}`)
    }
  }

  async clearAll(): Promise<void> {
    try {
      const db = await this.getDB()
      const transaction = db.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      
      await new Promise<void>((resolve, reject) => {
        const request = store.clear()
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })
    } catch (err) {
      console.warn('Failed to clear IndexedDB:', err)
      throw new Error(`Failed to clear storage: ${err}`)
    }
  }

  // Template management methods
  async saveTemplates(templates: Template[], currentTemplateId: string): Promise<void> {
    try {
      const db = await this.getDB()
      const transaction = db.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      
      await new Promise<void>((resolve, reject) => {
        const templatesRequest = store.put({ key: 'templates', value: JSON.stringify(templates) })
        const currentIdRequest = store.put({ key: 'currentTemplateId', value: currentTemplateId })
        
        templatesRequest.onsuccess = () => {
          currentIdRequest.onsuccess = () => resolve()
          currentIdRequest.onerror = () => reject(currentIdRequest.error)
        }
        templatesRequest.onerror = () => reject(templatesRequest.error)
      })
    } catch (err) {
      console.warn('Failed to save templates to IndexedDB:', err)
      throw new Error(`Failed to save templates: ${err}`)
    }
  }

  async getTemplates(): Promise<{ templates: Template[], currentTemplateId: string } | null> {
    try {
      const db = await this.getDB()
      const transaction = db.transaction([this.storeName], 'readonly')
      const store = transaction.objectStore(this.storeName)
      
      return new Promise((resolve, reject) => {
        const templatesRequest = store.get('templates')
        const currentIdRequest = store.get('currentTemplateId')
        
        let templatesResult: any = null
        let currentIdResult: any = null
        let completed = 0
        
        const checkComplete = () => {
          completed++
          if (completed === 2) {
            if (!templatesResult) {
              resolve(null)
              return
            }
            
            try {
              const templates = JSON.parse(templatesResult.value, (key, value) => {
                if (key === 'createdAt' || key === 'updatedAt') {
                  return new Date(value)
                }
                return value
              })
              
              resolve({
                templates,
                currentTemplateId: currentIdResult?.value || templates[0]?.id || 'default'
              })
            } catch (err) {
              reject(err)
            }
          }
        }
        
        templatesRequest.onsuccess = () => {
          templatesResult = templatesRequest.result
          checkComplete()
        }
        templatesRequest.onerror = () => reject(templatesRequest.error)
        
        currentIdRequest.onsuccess = () => {
          currentIdResult = currentIdRequest.result
          checkComplete()
        }
        currentIdRequest.onerror = () => reject(currentIdRequest.error)
      })
    } catch (err) {
      console.warn('Failed to read templates from IndexedDB:', err)
      return null
    }
  }

  // Convenience methods
  async saveTemplate(template: string): Promise<void> {
    return this.saveFile('template', template)
  }

  async getTemplate(): Promise<string | null> {
    return this.getFile('template')
  }

  async saveData(data: string): Promise<void> {
    return this.saveFile('data', data)
  }

  async getData(): Promise<string | null> {
    return this.getFile('data')
  }

  async saveLayout(layout: string): Promise<void> {
    return this.saveFile('layout', layout)
  }

  async getLayout(): Promise<string | null> {
    return this.getFile('layout')
  }

  async saveStyles(styles: string): Promise<void> {
    return this.saveFile('styles', styles)
  }

  async getStyles(): Promise<string | null> {
    return this.getFile('styles')
  }

  async savePreferences(useLayout: boolean): Promise<void> {
    return this.saveFile('useLayout', useLayout.toString())
  }

  async getPreferences(): Promise<{ useLayout: boolean } | null> {
    const value = await this.getFile('useLayout')
    if (value === null) return null
    return { useLayout: value === 'true' }
  }

  async saveTheme(theme: 'dark' | 'light'): Promise<void> {
    return this.saveFile('theme', theme)
  }

  async getTheme(): Promise<'dark' | 'light' | null> {
    const value = await this.getFile('theme')
    if (value === null) return null
    return value as 'dark' | 'light'
  }

  // Bulk operations
  async saveAll(data: Partial<{
    template: string
    data: string
    layout: string
    styles: string
    useLayout: boolean
    theme: 'dark' | 'light'
  }>): Promise<void> {
    const promises: Promise<void>[] = []
    
    if (data.template !== undefined) {
      promises.push(this.saveTemplate(data.template))
    }
    if (data.data !== undefined) {
      promises.push(this.saveData(data.data))
    }
    if (data.layout !== undefined) {
      promises.push(this.saveLayout(data.layout))
    }
    if (data.styles !== undefined) {
      promises.push(this.saveStyles(data.styles))
    }
    if (data.useLayout !== undefined) {
      promises.push(this.savePreferences(data.useLayout))
    }
    if (data.theme !== undefined) {
      promises.push(this.saveTheme(data.theme))
    }
    
    await Promise.all(promises)
  }

  async loadAll(): Promise<Partial<{
    template: string
    data: string
    layout: string
    styles: string
    useLayout: boolean
    theme: 'dark' | 'light'
  }>> {
    const [template, data, layout, styles, preferences, theme] = await Promise.all([
      this.getTemplate(),
      this.getData(),
      this.getLayout(),
      this.getStyles(),
      this.getPreferences(),
      this.getTheme()
    ])

    const result: any = {}
    
    if (template !== null) result.template = template
    if (data !== null) result.data = data
    if (layout !== null) result.layout = layout
    if (styles !== null) result.styles = styles
    if (preferences !== null) result.useLayout = preferences.useLayout
    if (theme !== null) result.theme = theme
    
    return result
  }
}
