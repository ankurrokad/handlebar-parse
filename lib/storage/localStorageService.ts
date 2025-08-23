import { StorageService } from './types'

export class LocalStorageService implements StorageService {
  private prefix = 'hbs-parser-'
  
  private getKey(key: string): string {
    return `${this.prefix}${key}`
  }

  async saveFile(key: string, value: string): Promise<void> {
    try {
      localStorage.setItem(this.getKey(key), value)
    } catch (err) {
      console.warn('Failed to save to localStorage:', err)
      throw new Error(`Failed to save ${key}: ${err}`)
    }
  }

  async getFile(key: string): Promise<string | null> {
    try {
      return localStorage.getItem(this.getKey(key))
    } catch (err) {
      console.warn('Failed to read from localStorage:', err)
      return null
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      localStorage.removeItem(this.getKey(key))
    } catch (err) {
      console.warn('Failed to delete from localStorage:', err)
      throw new Error(`Failed to delete ${key}: ${err}`)
    }
  }

  async clearAll(): Promise<void> {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key)
        }
      })
    } catch (err) {
      console.warn('Failed to clear localStorage:', err)
      throw new Error(`Failed to clear storage: ${err}`)
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
