# HBS Parser - Real-time Handlebars Template Editor

A modern, production-ready web application for real-time Handlebars template development with live preview, built with Next.js, Monaco Editor, and a beautiful dark theme UI.

## 🚀 Features

### **Core Functionality**
- **Real-time Handlebars Compilation** - Instant template rendering as you type
- **Live HTML Preview** - See results immediately in a responsive preview panel
- **Layout System** - Support for Handlebars layouts with `{{{body}}}` placeholder
- **Custom CSS Styling** - Dedicated styles tab for template customization
- **Auto-save** - Automatic localStorage persistence for all content
- **Manual Save** - Ctrl+S shortcut for immediate saving

### **Editor Features**
- **Monaco Editor Integration** - VS Code-like editing experience
- **Syntax Highlighting** - Support for Handlebars, HTML, CSS, and JSON
- **Auto-completion** - Intelligent suggestions for all supported languages
- **Multiple Tabs** - Organized workflow: Layout → Body → Data → Styles
- **Import/Export** - File upload support for all content types
- **Copy Functionality** - Copy current tab content or final HTML

### **Developer Experience**
- **Dark Theme** - Professional dark UI with Vercel-inspired colors
- **Responsive Design** - Full-screen layout optimized for development
- **Keyboard Shortcuts** - Ctrl+S for save, intuitive navigation
- **Error Handling** - Clear error messages with syntax highlighting
- **Auto-play Toggle** - Control real-time compilation
- **Layout Toggle** - Enable/disable layout system

### **Advanced Features**
- **Custom Handlebars Helpers** - Built-in helpers for common operations
- **Persistent Storage** - All work automatically saved to localStorage
- **Reset to Defaults** - Quick restoration of sample templates
- **Theme Persistence** - User preferences saved across sessions
- **Responsive Preview** - Mobile-friendly HTML rendering

## 🏗️ Architecture & Code Quality

### **Modern React Architecture**

The application follows **modern React best practices** with a clean, maintainable architecture:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Monaco Editor │    │  Handlebars.js  │    │  Live Preview   │
│   (Input)       │───▶│  (Compiler)     │───▶│  (Output)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Component Structure**

The codebase is organized into **focused, reusable components**:

```
components/
├── layout/          # Header, Background, MainContent
├── editor/          # LeftPanel, TabNavigation, EditorPanel, MonacoEditor
└── preview/         # RightPanel, PreviewPanel

lib/
├── hooks/           # useEditor, useTheme
└── utils/           # File operations, clipboard functions
```

### **Key Benefits**

✅ **Maintainable**: Each component has a single responsibility  
✅ **Reusable**: Components can be shared across the application  
✅ **Testable**: Individual pieces can be tested in isolation  
✅ **Performance**: Better code splitting and optimization  
✅ **Developer Experience**: Easy to navigate and debug

### **Data Flow & State Management**

1. **User Input** → Monaco Editor captures changes in real-time
2. **State Update** → Custom hooks manage state updates and trigger re-renders
3. **Handlebars Compilation** → Template + Data + Layout compiled together
4. **CSS Injection** → Custom styles automatically injected into output
5. **HTML Rendering** → Final HTML displayed in preview panel
6. **Auto-save** → All content automatically persisted to localStorage

### **State Management Architecture**

- **`useEditor` Hook**: Centralizes all editor state and Handlebars compilation logic
- **`useTheme` Hook**: Manages theme state and localStorage persistence
- **Component Props**: Clean data flow with props down, events up pattern
- **Separation of Concerns**: UI components focus on rendering, hooks handle logic

### **Template Processing Pipeline**

```
Template (HBS) + Data (JSON) + Layout (HTML) + Styles (CSS)
                    ↓
            Handlebars.compile()
                    ↓
            Template Rendering
                    ↓
            Layout Application (if enabled)
                    ↓
            CSS Injection
                    ↓
            Final HTML Output
```

### **Component Architecture Breakdown**

#### **1. Layout Components**
- **`Header`** - Application controls (auto-play, layout, theme, reset)
- **`Background`** - Animated background elements
- **`MainContent`** - Main content wrapper with left/right panels

#### **2. Editor Components**
- **`LeftPanel`** - Contains the editor interface and tab navigation
- **`TabNavigation`** - Manages tab switching and shows save status
- **`EditorPanel`** - Handles tab content switching with animations
- **`MonacoEditor`** - Reusable Monaco editor with file import support

#### **3. Preview Components**
- **`RightPanel`** - Contains the HTML preview panel
- **`PreviewPanel`** - Handles error display and HTML rendering

#### **4. State Management (Custom Hooks)**
- **`useEditor`** - Centralizes all editor state and Handlebars compilation
- **`useTheme`** - Manages theme state and localStorage persistence

#### **2. Handlebars Integration**
- **Custom Helpers**: `formatDate`, `eq`, `gt`, `lt`
- **Layout Support**: Conditional layout application based on `useLayout` state
- **Error Handling**: Graceful fallback for compilation errors
- **Real-time Updates**: Automatic recompilation on content changes

#### **3. Monaco Editor Configuration**
- **Language Support**: Handlebars, HTML, CSS, JSON
- **Editor Options**: Syntax highlighting, auto-completion, minimap disabled
- **Keyboard Shortcuts**: Custom Ctrl+S handling to prevent browser defaults
- **Theme Integration**: Dark/light theme support

## 🎯 Code Quality & Maintainability

### **Refactoring Benefits**

The application has been **refactored from a monolithic 1000-line component** into a clean, maintainable architecture:

- **Before**: Single file with mixed concerns (1000+ lines)
- **After**: 9 focused components + 2 custom hooks + utilities (~93 lines main component)

### **Architecture Principles**

- **Single Responsibility**: Each component has one clear purpose
- **Separation of Concerns**: UI, logic, and utilities are separate
- **Props Down, Events Up**: Clean data flow between components
- **Reusable Components**: Components can be shared and tested independently
- **Custom Hooks**: Business logic extracted into reusable hooks

### **Production Readiness**

✅ **Maintainable**: Easy to debug, test, and modify  
✅ **Scalable**: New features can be added without touching existing code  
✅ **Professional**: Follows React best practices and industry standards  
✅ **Team-Friendly**: Multiple developers can work on different components  
✅ **Performance**: Better code splitting and optimization opportunities

#### **4. CSS Injection System**
- **Smart Placement**: Styles automatically inserted into `<head>` for layouts
- **Fallback Handling**: Styles prepended to template output when no layout
- **Real-time Updates**: CSS changes immediately reflected in preview

#### **5. Persistence Layer**
- **localStorage Integration**: Automatic saving of all content types
- **Preference Storage**: Theme and layout settings persisted
- **Auto-save Triggers**: Save on every content change
- **Manual Save**: Ctrl+S shortcut for immediate persistence

### **File Structure & Organization**

```
app/
├── page.tsx              # Main application component
├── layout.tsx            # Root layout with providers
├── globals.css           # Global styles and Tailwind
├── metadata.ts           # SEO and app metadata
└── manifest.ts           # PWA manifest
components/
├── ui/                   # Reusable UI components
│   ├── button.tsx        # Custom button component
│   ├── card.tsx          # Glassmorphic card component
│   └── separator.tsx     # Visual separator component
├── error-boundary.tsx    # Error handling component
├── loading.tsx           # Loading state component
└── providers.tsx         # Client-side providers wrapper
```

### **Technology Stack**

- **Frontend Framework**: Next.js 14 with App Router
- **UI Library**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom dark theme
- **Code Editor**: Monaco Editor (VS Code engine)
- **Templating**: Handlebars.js for template compilation
- **Animations**: Framer Motion for smooth transitions
- **State Management**: React hooks with localStorage persistence
- **Build Tool**: Webpack with custom configurations

### **Key Functions & Methods**

#### **Template Compilation**
```typescript
useEffect(() => {
  if (!isPlaying) return
  
  try {
    const parsedData = JSON.parse(data)
    const templateFn = Handlebars.compile(template)
    const templateResult = templateFn(parsedData)
    
    let result = templateResult
    
    if (useLayout) {
      const layoutData = { ...parsedData, body: templateResult }
      const layoutFn = Handlebars.compile(layout)
      result = layoutFn(layoutData)
    }
    
    if (styles.trim()) {
      const styleTag = `<style>\n${styles}\n</style>`
      if (useLayout) {
        result = result.replace('</head>', `${styleTag}\n</head>`)
      } else {
        result = styleTag + '\n' + result
      }
    }
    
    setCompiledHtml(result)
    setError('')
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Unknown error')
    setCompiledHtml('')
  }
}, [template, data, layout, styles, useLayout, isPlaying])
```

#### **Auto-save System**
```typescript
const saveToStorage = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value)
    setLastSaved(new Date())
  } catch (err) {
    console.warn('Failed to save to localStorage:', err)
  }
}
```

#### **Keyboard Shortcut Handling**
```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault()
      e.stopPropagation()
      manualSave()
      return false
    }
  }
  
  document.addEventListener('keydown', handleKeyDown, true)
  return () => document.removeEventListener('keydown', handleKeyDown, true)
}, [template, data, layout, styles])
```

### **User Workflow**

1. **Setup**: Choose between layout and non-layout mode
2. **Template Creation**: Write Handlebars templates in the body tab
3. **Data Input**: Provide JSON data for template variables
4. **Layout Design**: Create HTML structure with `{{{body}}}` placeholder
5. **Styling**: Add custom CSS for visual customization
6. **Preview**: See real-time results in the preview panel
7. **Iteration**: Make changes and see immediate updates
8. **Export**: Copy final HTML or save work automatically

### **Error Handling Strategy**

- **Compilation Errors**: Clear error messages with syntax highlighting
- **JSON Validation**: Automatic parsing with fallback error display
- **Graceful Degradation**: Preview shows error state instead of crashing
- **User Feedback**: Visual indicators for error states

### **Performance Optimizations**

- **Debounced Updates**: Efficient re-rendering on content changes
- **Monaco Editor**: Optimized code editing performance
- **CSS-in-JS**: Efficient style injection without DOM manipulation
- **Lazy Loading**: Suspense boundaries for better initial load times

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ 
- pnpm (recommended) or npm

### **Project Structure**

```
HBS Parser/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main page component (93 lines)
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/             # Reusable UI components
│   ├── layout/            # Layout components
│   ├── editor/            # Editor components
│   ├── preview/           # Preview components
│   └── index.ts           # Component exports
├── lib/                   # Utilities and hooks
│   ├── hooks/             # Custom React hooks
│   └── utils/             # Utility functions
└── types/                 # TypeScript type definitions
```

### **Development Workflow**

1. **Component Development**: Work on individual components in isolation
2. **Hook Logic**: Business logic is centralized in custom hooks
3. **State Management**: Clean data flow with props and event handlers
4. **Testing**: Each component and hook can be tested independently

### **Installation**
```bash
git clone https://github.com/ankurrokad/handlebar-parse.git
cd handlebar-parse
pnpm install
pnpm dev
```

### **Usage**
1. **Open the app** in your browser
2. **Switch between tabs** to edit different content types
3. **Write Handlebars templates** with live preview
4. **Add JSON data** for template variables
5. **Customize with CSS** for styling
6. **Use Ctrl+S** to save your work
7. **Toggle layout mode** as needed

### **Component Development**

- **Adding New Features**: Create new components in appropriate directories
- **Modifying Logic**: Update custom hooks for business logic changes
- **Styling Changes**: Modify component-specific styles or global CSS
- **Testing**: Test individual components and hooks in isolation

## 🔧 Configuration

### **Environment Variables**
- No environment variables required for basic functionality
- Configure `metadataBase` in `app/metadata.ts` for production deployment

### **Customization**
- **Theme Colors**: Modify `tailwind.config.js` for custom color schemes
- **Editor Options**: Adjust Monaco Editor settings in `app/page.tsx`
- **Handlebars Helpers**: Add custom helpers in the `useEffect` hook

## 📱 Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Features**: ES2020, CSS Grid, Flexbox, localStorage
- **Fallbacks**: Graceful degradation for older browsers

## 🤝 Contributing

### **Development Guidelines**

1. **Fork the repository**
2. **Create a feature branch**
3. **Follow the component architecture**:
   - UI changes → Modify components
   - Logic changes → Update custom hooks
   - Utility functions → Add to lib/utils
4. **Test thoroughly** - Each component can be tested independently
5. **Submit a pull request**

### **Code Quality Standards**

- **Single Responsibility**: Each component should have one clear purpose
- **Props Interface**: Define clear TypeScript interfaces for all props
- **Event Handling**: Use consistent event handler patterns
- **Error Boundaries**: Implement proper error handling
- **Performance**: Consider React.memo for expensive components

## 🆘 Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Check the documentation above
- Review the code structure and comments

---

**Built with ❤️ for the Handlebars community**
