# Storage Service Architecture

This directory contains a flexible, service-based storage architecture that allows the HBS Parser app to easily switch between different storage backends.

## 🏗️ Architecture Overview

The storage system is built around three main concepts:

1. **Storage Interface** - Abstract contract for all storage operations
2. **Storage Implementations** - Concrete implementations for different backends
3. **Storage Service Manager** - Central service that can switch between implementations

## 📁 File Structure

```
lib/storage/
├── types.ts              # Storage interfaces and types
├── localStorageService.ts # localStorage implementation
├── indexedDBService.ts   # IndexedDB implementation
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

### Switching Storage Providers

```typescript
import { storageService } from '@/lib/storage'

// Switch to IndexedDB
await storageService.switchProvider('indexedDB')

// Switch to localStorage
await storageService.switchProvider('localStorage')

// Get current provider
const current = storageService.getCurrentProvider() // 'localStorage' | 'indexedDB'
```

### Using the Storage Hook

```typescript
import { useStorage } from '@/lib/hooks'

function MyComponent() {
  const { 
    currentProvider, 
    isLoading, 
    error, 
    switchStorageProvider 
  } = useStorage()

  const handleSwitch = async () => {
    await switchStorageProvider('indexedDB')
  }

  return (
    <div>
      <p>Current: {currentProvider}</p>
      <button onClick={handleSwitch} disabled={isLoading}>
        Switch to IndexedDB
      </button>
      {error && <p>Error: {error}</p>}
    </div>
  )
}
```

## 🔄 Available Storage Providers

### 1. LocalStorage (Default)
- **Implementation**: `LocalStorageService`
- **Pros**: Simple, fast, no setup required
- **Cons**: Limited storage (5-10MB), data lost when browser data is cleared
- **Use Case**: Default storage, development, simple projects

### 2. IndexedDB
- **Implementation**: `IndexedDBService`
- **Pros**: Large storage capacity, persistent, structured data
- **Cons**: More complex, async operations
- **Use Case**: Large projects, offline-first apps, better persistence

### 3. MongoDB (Coming Soon)
- **Implementation**: `MongoDBService`
- **Pros**: Cloud storage, cross-device sync, backup
- **Cons**: Requires setup, network dependency
- **Use Case**: Production apps, team collaboration, cross-device sync

### 4. Supabase (Coming Soon)
- **Implementation**: `SupabaseService`
- **Pros**: Real-time sync, authentication, built-in backend
- **Cons**: Requires Supabase account, network dependency
- **Use Case**: Real-time collaboration, user accounts, production apps

## 🛠️ Adding New Storage Providers

To add a new storage provider:

1. **Create the implementation**:
```typescript
// lib/storage/myCustomService.ts
import { StorageService } from './types'

export class MyCustomService implements StorageService {
  // Implement all required methods
  async saveFile(key: string, value: string): Promise<void> {
    // Your implementation
  }
  
  // ... implement all other methods
}
```

2. **Add to the service manager**:
```typescript
// lib/storage/storageService.ts
import { MyCustomService } from './myCustomService'

// In the switchProvider method:
case 'myCustom':
  newService = new MyCustomService()
  break
```

3. **Update types**:
```typescript
// lib/storage/types.ts
export type StorageProvider = 'localStorage' | 'indexedDB' | 'mongodb' | 'supabase' | 'myCustom'
```

## 🔧 Configuration

Storage providers can accept configuration options:

```typescript
// Switch with options
await storageService.switchProvider('mongodb', {
  connectionString: 'mongodb://localhost:27017',
  database: 'hbs-parser',
  collection: 'templates'
})

// Get current config
const config = storageService.getConfig()
console.log(config.provider, config.options)
```

## 📊 Data Migration

When switching between storage providers, the system automatically migrates existing data:

```typescript
// This will:
// 1. Load all data from current provider
// 2. Switch to new provider
// 3. Save all data to new provider
await storageService.switchProvider('indexedDB')
```

## 🎯 Best Practices

### 1. Error Handling
```typescript
try {
  await storageService.saveFile('key', 'value')
} catch (err) {
  console.error('Storage failed:', err)
  // Fallback to localStorage or show user message
}
```

### 2. Async Operations
```typescript
// All storage operations are async
const saveData = async () => {
  await storageService.saveAll({
    template: '{{title}}',
    data: '{"title": "Hello"}'
  })
}
```

### 3. Provider Switching
```typescript
// Always handle provider switching gracefully
const switchProvider = async (provider: StorageProvider) => {
  try {
    await storageService.switchProvider(provider)
    // Success - data migrated automatically
  } catch (err) {
    // Handle failure - maybe fallback to localStorage
    console.error('Provider switch failed:', err)
  }
}
```

## 🧪 Testing

The storage service can be easily mocked for testing:

```typescript
// Mock storage service
const mockStorageService = {
  saveFile: jest.fn(),
  getFile: jest.fn(),
  // ... other methods
}

// Use in tests
jest.mock('@/lib/storage', () => ({
  storageService: mockStorageService
}))
```

## 🚀 Future Enhancements

- [ ] **MongoDB Service**: Cloud storage with user authentication
- [ ] **Supabase Service**: Real-time sync and backend services
- [ ] **Encryption**: Data encryption for sensitive templates
- [ ] **Compression**: Data compression for large templates
- [ ] **Backup/Restore**: Export/import storage data
- [ ] **Sync**: Cross-device synchronization
- [ ] **Offline Support**: Offline-first storage strategies

## 📝 Migration from Direct localStorage

The app has been migrated from direct localStorage calls to the storage service:

### Before (Direct localStorage)
```typescript
// Old way
localStorage.setItem('hbs-parser-template', template)
const saved = localStorage.getItem('hbs-parser-template')
```

### After (Storage Service)
```typescript
// New way
await storageService.saveTemplate(template)
const saved = await storageService.getTemplate()
```

### Benefits
- ✅ **Flexible**: Easy to switch storage backends
- ✅ **Testable**: Easy to mock for testing
- ✅ **Maintainable**: Centralized storage logic
- ✅ **Scalable**: Easy to add new features
- ✅ **Type-safe**: Full TypeScript support
