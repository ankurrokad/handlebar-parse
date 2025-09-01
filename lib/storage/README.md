# Storage Service

The storage service provides a unified interface for managing data persistence across different storage providers. Currently, it supports **Supabase** as the primary storage backend.

## Architecture

The storage system is designed with a service-based architecture:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Application   │───▶│ Storage Manager │───▶│ Storage Service │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Current Implementation

### **Supabase Storage** (Exclusive)
- **Provider**: `supabase`
- **Tables**: `templates` only
- **Features**: Template CRUD operations, automatic ID management
- **No app_data**: Settings and preferences are no longer stored in Supabase

## Usage

### **Basic Template Operations**

```typescript
import { storageService } from '@/lib/storage'

// Save templates
await storageService.saveTemplates(templates, currentTemplateId)

// Get templates
const data = await storageService.getTemplates()

// Clear all data
await storageService.clearAll()

// Bulk operations
await storageService.saveAll({ templates, currentTemplateId })
const allData = await storageService.loadAll()
```

### **Template Management**

```typescript
// Save multiple templates
const templates = [
  {
    id: 'template-1',
    name: 'My Template',
    slug: 'my-template',
    template: '<h1>{{title}}</h1>',
    data: '{"title": "Hello"}',
    layout: '<div>{{{body}}}</div>',
    styles: 'h1 { color: blue; }',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

await storageService.saveTemplates(templates, 'template-1')
```

## Storage Structure

### **Templates Table**
```sql
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **Data Flow**
1. **Template Creation**: New templates get temporary IDs (`temp-*`)
2. **Supabase Sync**: Templates are upserted to Supabase with proper UUIDs
3. **ID Resolution**: Temporary IDs are replaced with actual Supabase UUIDs
4. **Persistence**: All template data is automatically saved to Supabase

## Key Features

✅ **Template Persistence**: All templates automatically saved to Supabase  
✅ **Automatic ID Management**: Handles temporary vs. permanent IDs seamlessly  
✅ **Conflict Resolution**: Prevents duplicate template names  
✅ **Bulk Operations**: Save/load multiple templates efficiently  
✅ **Error Handling**: Comprehensive error logging and fallbacks  

## Migration Notes

### **Removed Functionality**
- ❌ `saveFile()` / `getFile()` / `deleteFile()` - No more app_data storage
- ❌ `saveTheme()` / `getTheme()` - Theme preferences not persisted
- ❌ `savePreferences()` / `getPreferences()` - Layout preferences not persisted
- ❌ `saveData()` / `getData()` - Template data not separately stored
- ❌ `saveLayout()` / `getLayout()` - Layout not separately stored
- ❌ `saveStyles()` / `getStyles()` - Styles not separately stored

### **Current Functionality**
- ✅ Template CRUD operations
- ✅ Template metadata management
- ✅ Automatic Supabase synchronization
- ✅ Bulk template operations

## Error Handling

The storage service includes comprehensive error handling:

```typescript
try {
  await storageService.saveTemplates(templates, currentTemplateId)
} catch (error) {
  console.error('Storage operation failed:', error)
  // Handle error appropriately
}
```

## Future Considerations

- **Local Storage Fallback**: Could add localStorage for offline functionality
- **Multiple Providers**: Architecture supports adding other storage backends
- **Caching Layer**: Could add Redis or similar for performance
- **Backup/Restore**: Could add export/import functionality

---

**Note**: This storage service is designed to be **template-focused only**. User preferences, themes, and other app settings are managed locally and not persisted to Supabase.
