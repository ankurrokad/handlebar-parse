# Supabase Integration for HBS Parser

This document explains how to use the Supabase integration for saving and loading templates in the HBS Parser application.

## What's Been Implemented

### 1. Supabase Client Configuration
- **File**: `lib/supabase/client.ts`
- **Purpose**: Creates and configures the Supabase client connection
- **Features**: 
  - Environment variable validation
  - TypeScript database types
  - Error handling for missing credentials

### 2. Supabase Storage Service
- **File**: `lib/storage/supabaseService.ts`
- **Purpose**: Implements the `StorageService` interface for Supabase
- **Features**:
  - Template CRUD operations in Supabase
  - Fallback to localStorage for non-template data
  - Automatic data migration when switching providers
  - Error handling and logging

### 3. Storage Service Manager Updates
- **File**: `lib/storage/storageService.ts`
- **Purpose**: Manages switching between different storage providers
- **Features**:
  - Support for Supabase provider
  - Automatic data migration between providers
  - Provider status tracking

### 4. Supabase Hook
- **File**: `lib/hooks/useSupabase.ts`
- **Purpose**: React hook for managing Supabase connection state
- **Features**:
  - Connection status monitoring
  - Provider switching functionality
  - Error handling and loading states

### 5. UI Components
- **File**: `components/ui/supabase-status.tsx`
- **Purpose**: Visual component showing Supabase connection status
- **Features**:
  - Real-time connection status
  - Provider switching button
  - Error display
  - Connection testing



## Database Schema

The integration expects a `templates` table in your Supabase database with the following structure:

```sql
CREATE TABLE templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  template TEXT NOT NULL,
  data TEXT NOT NULL,
  layout TEXT NOT NULL,
  styles TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_templates_slug ON templates(slug);
CREATE INDEX idx_templates_updated_at ON templates(updated_at);
```

## Environment Variables

Make sure you have the following variables in your `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Usage

### 1. Switch to Supabase Storage

```typescript
import { useSupabase } from '@/lib/hooks'

function MyComponent() {
  const { switchToSupabase, isSupabaseActive } = useSupabase()
  
  const handleSwitch = async () => {
    try {
      await switchToSupabase()
      console.log('Successfully switched to Supabase!')
    } catch (error) {
      console.error('Failed to switch:', error)
    }
  }
  
  return (
    <button onClick={handleSwitch} disabled={isSupabaseActive}>
      Switch to Supabase
    </button>
  )
}
```

### 2. Save Templates

```typescript
import { useStorage } from '@/lib/hooks'

function MyComponent() {
  const { saveTemplates, templates } = useStorage()
  
  const handleSave = async () => {
    const newTemplate = {
      id: `template-${Date.now()}`,
      name: 'My Template',
      slug: 'my-template',
      template: '<h1>{{title}}</h1>',
      data: JSON.stringify({ title: 'Hello' }),
      layout: '<div>{{{body}}}</div>',
      styles: 'h1 { color: blue; }',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const newTemplates = [...templates, newTemplate]
    await saveTemplates(newTemplates, newTemplate.id)
  }
  
  return <button onClick={handleSave}>Save Template</button>
}
```

### 3. Load Templates

```typescript
import { useStorage } from '@/lib/hooks'

function MyComponent() {
  const { templates, currentTemplateId } = useStorage()
  
  return (
    <div>
      <h3>Current Template: {currentTemplateId}</h3>
      <ul>
        {templates.map(template => (
          <li key={template.id}>{template.name}</li>
        ))}
      </ul>
    </div>
  )
}
```

## Testing the Integration

1. **Check connection status**: The Supabase Status indicator in the header shows if you're connected
2. **Create and edit templates**: Templates are automatically saved to Supabase when you create or modify them
3. **Verify environment variables**: Check that your Supabase credentials are properly loaded
4. **Monitor console logs**: Look for Supabase operation logs in the browser console

## Migration from Local Storage

When you switch to Supabase:

1. **Automatic migration**: The system automatically migrates existing templates
2. **Data preservation**: All template data is preserved during the switch
3. **Fallback support**: Non-template data (theme, preferences) remains in localStorage
4. **Seamless switching**: You can switch back to localStorage if needed

## Error Handling

The integration includes comprehensive error handling:

- **Connection errors**: Displayed in the UI with retry options
- **Save/load errors**: Caught and displayed to the user
- **Migration errors**: Logged but don't prevent provider switching
- **Environment variable errors**: Clear error messages for missing credentials

## Performance Considerations

- **Lazy loading**: Supabase client is only loaded when needed
- **Caching**: Templates are cached locally for quick access
- **Batch operations**: Multiple templates are saved efficiently
- **Connection pooling**: Reuses database connections when possible

## Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables"**
   - Check your `.env.local` file
   - Ensure variables start with `NEXT_PUBLIC_`
   - Restart your development server

2. **"Failed to connect to Supabase"**
   - Verify your Supabase URL and key
   - Check your database permissions
   - Ensure the `templates` table exists

3. **"Templates not saving"**
   - Check browser console for errors
   - Verify database table structure
   - Check Row Level Security (RLS) policies

### Debug Mode

Enable debug logging by adding this to your component:

```typescript
useEffect(() => {
  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log('Supabase Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}, [])
```

## Future Enhancements

- [ ] Real-time template synchronization
- [ ] Template sharing between users
- [ ] Version control for templates
- [ ] Template categories and tags
- [ ] Advanced search and filtering
- [ ] Template import/export from Supabase
- [ ] Backup and restore functionality

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify your Supabase configuration
3. Check the Supabase dashboard for database issues
