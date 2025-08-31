# Storage Service Architecture

This directory contains the storage architecture for the HBS Parser app, which exclusively uses Supabase as the storage backend.

## 🏗️ Architecture Overview

The storage system is built around a single, focused concept:

1. **Storage Interface** - Abstract contract for all storage operations
2. **Supabase Implementation** - Concrete implementation for Supabase backend
3. **Storage Service Manager** - Central service that manages Supabase storage

## 📁 File Structure

```
lib/storage/
├── types.ts              # Storage interfaces and types
├── supabaseService.ts    # Supabase implementation
├── storageService.ts     # Main service manager
├── index.ts             # Public exports
└── README.md            # This documentation
```

## 🔌 Storage Interface

All storage implementations must implement the `StorageService` interface:

```typescript
interface StorageService {
  // Core operations
  saveFile(key: string, value: string): Promise<void>
  getFile(key: string): Promise<string | null>
  deleteFile(key: string): Promise<void>
  clearAll(): Promise<void>
  
  // Convenience methods
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
```

## 🚀 Usage Examples

### Basic Usage

```typescript
import { storageService } from '@/lib/storage'

// Save a file
await storageService.saveFile('my-key', 'my-value')

// Get a file
const value = await storageService.getFile('my-key')

// Save template
await storageService.saveTemplate('<h1>{{title}}</h1>')

// Load all data
const allData = await storageService.loadAll()
```

### Using the Storage Hook

```typescript
import { useStorage } from '@/lib/hooks'

function MyComponent() {
  const { 
    isLoading, 
    error, 
    clearStorage 
  } = useStorage()

  const handleClear = async () => {
    await clearStorage()
  }

  return (
    <div>
      <button onClick={handleClear} disabled={isLoading}>
        Clear Storage
      </button>
      {error && <p>Error: {error}</p>}
    </div>
  )
}
```

## 🔄 Storage Provider

### Supabase (Exclusive)
- **Implementation**: `SupabaseService`
- **Pros**: Real-time sync, authentication, built-in backend, cloud storage, cross-device sync
- **Cons**: Requires Supabase account, network dependency
- **Use Case**: Production app with real-time collaboration, user accounts, cross-device sync

## 🔧 Configuration

The app automatically configures Supabase storage:

```typescript
// The storage service automatically uses Supabase
const storageManager = StorageServiceManager.getInstance()
const currentProvider = storageManager.getCurrentProvider() // Always 'supabase'
```

## 📊 Data Migration

The system automatically handles data persistence through Supabase:

```typescript
// All data is automatically saved to Supabase
await storageService.saveTemplate('<h1>{{title}}</h1>')
await storageService.saveData('{"title": "Hello World"}')
```

## 🚫 Removed Features

The following storage options have been removed to simplify the app:

- **LocalStorage**: No longer available
- **IndexedDB**: No longer available  
- **MongoDB**: No longer available
- **Custom Storage**: No longer available
- **Storage Provider Switching**: No longer available

The app now exclusively uses Supabase for all storage operations, providing a consistent and reliable cloud-based storage solution.
