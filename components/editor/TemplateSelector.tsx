'use client'

import { useState } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { ChevronDown, Plus, Edit3, Trash2, Copy, Download, Check, X } from 'lucide-react'
import { Template } from '@/lib/hooks/useEditor'

interface TemplateSelectorProps {
  templates: Template[]
  currentTemplateId: string
  isDarkTheme: boolean
  onSwitchTemplate: (templateId: string) => void
  onCreateTemplate: (name: string) => void
  onDeleteTemplate: (templateId: string) => void
  onRenameTemplate: (templateId: string, newName: string) => void
  onCopyTemplate: (template: Template) => void
  onExportTemplate: (template: Template) => void

}

export function TemplateSelector({
  templates,
  currentTemplateId,
  isDarkTheme,
  onSwitchTemplate,
  onCreateTemplate,
  onDeleteTemplate,
  onRenameTemplate,
  onCopyTemplate,
  onExportTemplate
}: TemplateSelectorProps) {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [newTemplateName, setNewTemplateName] = useState('')


  const currentTemplate = templates.find(t => t.id === currentTemplateId)

  const handleCreateTemplate = () => {
    if (newTemplateName.trim()) {
      onCreateTemplate(newTemplateName.trim())
      setNewTemplateName('')
      setShowCreateForm(false)
    }
  }

  const handleRenameTemplate = () => {
    if (editingTemplate && newTemplateName.trim()) {
      onRenameTemplate(editingTemplate.id, newTemplateName.trim())
      setNewTemplateName('')
      setEditingTemplate(null)
    }
  }

  const handleCopyTemplate = (template: Template) => {
    const newName = `${template.name} (Copy)`
    onCreateTemplate(newName)
  }

  const handleExportTemplate = (template: Template) => {
    onExportTemplate(template)
  }





  // Clean, modern theme styles
  const themeStyles = {
    trigger: isDarkTheme 
      ? 'bg-transparent hover:bg-white/10 text-gray-300 hover:text-white border border-gray-700 hover:border-gray-600' 
      : 'bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900 border border-gray-300 hover:border-gray-400',
    content: isDarkTheme 
      ? 'bg-gray-900 shadow-2xl' 
      : 'bg-white shadow-xl',
    item: isDarkTheme 
      ? 'text-gray-300 hover:bg-gray-800 hover:text-white' 
      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
    selected: isDarkTheme 
      ? 'bg-blue-600 text-white' 
      : 'bg-blue-50 text-blue-700',
    input: isDarkTheme 
      ? 'bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-blue-500' 
      : 'bg-white border-gray-300 text-gray-700 placeholder-gray-500 focus:border-blue-500',
    button: isDarkTheme 
      ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border-gray-600' 
      : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 border-gray-300'
  }

  return (
    <div className="relative">

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            className={`inline-flex items-center gap-2 px-2 py-1 text-xs font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${themeStyles.trigger}`}
            aria-label="Select template"
          >
            <span className="truncate max-w-32">
              {currentTemplate?.name || 'Select Template'}
            </span>
            <ChevronDown className="h-3 w-3 transition-transform duration-200" />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className={`min-w-[240px] ${themeStyles.content} rounded-lg shadow-xl p-1 z-50 animate-in fade-in-0 zoom-in-95 duration-200`}
            sideOffset={8}
            align="start"
          >
            {/* Template List */}
            {templates.map((template) => (
              <div key={template.id} className="group relative">
                <DropdownMenu.Item
                  className={`flex items-center justify-between px-3 py-2 text-xs rounded-md cursor-pointer transition-colors duration-150 ${template.id === currentTemplateId ? themeStyles.selected : themeStyles.item}`}
                  onClick={() => onSwitchTemplate(template.id)}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{template.name}</div>
                    </div>
                    
                    {template.id === currentTemplateId && (
                      <Check className="h-3 w-3 flex-shrink-0" />
                    )}
                  </div>
                </DropdownMenu.Item>
                
                {/* Hover Actions */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setEditingTemplate(template)
                      setNewTemplateName(template.name)
                    }}
                    className={`p-1.5 rounded-md transition-colors duration-200 ${themeStyles.button}`}
                    title="Rename"
                  >
                    <Edit3 className="h-3 w-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCopyTemplate(template)
                    }}
                    className={`p-1.5 rounded-md transition-colors duration-200 ${themeStyles.button}`}
                    title="Copy"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleExportTemplate(template)
                    }}
                    className={`p-1.5 rounded-md transition-colors duration-200 ${themeStyles.button}`}
                    title="Export"
                  >
                    <Download className="h-3 w-3" />
                  </button>
                  {templates.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteTemplate(template.id)
                      }}
                      className="p-1.5 rounded-md transition-colors duration-200 bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700"
                      title="Delete"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Action Buttons */}
            <DropdownMenu.Separator className={`h-px ${isDarkTheme ? 'bg-gray-700' : 'bg-gray-200'} my-1`} />
            

            <DropdownMenu.Item
              className={`flex items-center gap-2 px-3 py-2 text-xs rounded-md cursor-pointer transition-colors duration-150 ${themeStyles.item}`}
              onClick={(e) => {
                e.preventDefault()
                setShowCreateForm(!showCreateForm)
              }}
              onSelect={(e) => e.preventDefault()}
            >
              <Plus className="h-3 w-3" />
              Create New Template
            </DropdownMenu.Item>

            {/* Create Template Form */}
            {showCreateForm && (
              <div className={`px-3 py-3 border-t ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'} mt-1`}>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Template Name"
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                    className={`w-full px-2 py-1.5 text-xs border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${themeStyles.input}`}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleCreateTemplate}
                      disabled={!newTemplateName.trim()}
                      className="flex-1 px-2 py-1.5 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      Create
                    </button>
                    <button
                      onClick={() => {
                        setShowCreateForm(false)
                        setNewTemplateName('')
                      }}
                      className={`px-2 py-1.5 text-xs border rounded-md transition-colors duration-200 ${themeStyles.button}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Template Form */}
            {editingTemplate && (
              <div className={`px-3 py-3 border-t ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'} mt-1 ${isDarkTheme ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                <div className="space-y-3">
                  <div className={`text-xs font-medium ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>Edit Template</div>
                  <input
                    type="text"
                    placeholder="Template Name"
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                    className={`w-full px-2 py-1.5 text-xs border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${themeStyles.input}`}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleRenameTemplate}
                      disabled={!newTemplateName.trim()}
                      className="flex-1 px-2 py-1.5 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingTemplate(null)
                        setNewTemplateName('')
                      }}
                      className={`px-2 py-1.5 text-xs border rounded-md transition-colors duration-200 ${themeStyles.button}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  )
}
