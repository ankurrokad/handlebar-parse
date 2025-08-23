'use client'

import { useState, useRef } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { ChevronDown, Plus, Edit3, Trash2, Copy, Download, Upload, Check } from 'lucide-react'
import { Template } from '@/lib/hooks/useEditor'

interface TemplateSelectorProps {
  templates: Template[]
  currentTemplateId: string
  isDarkTheme: boolean
  onSwitchTemplate: (templateId: string) => void
  onCreateTemplate: (name: string, slug: string) => void
  onDeleteTemplate: (templateId: string) => void
  onRenameTemplate: (templateId: string, newName: string, newSlug: string) => void
  onCopyTemplate: (template: Template) => void
  onExportTemplate: (template: Template) => void
  onImportTemplate: (file: File) => Promise<boolean>
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
  onExportTemplate,
  onImportTemplate
}: TemplateSelectorProps) {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [newTemplateName, setNewTemplateName] = useState('')
  const [newTemplateSlug, setNewTemplateSlug] = useState('')
  const [isImporting, setIsImporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const currentTemplate = templates.find(t => t.id === currentTemplateId)

  const handleCreateTemplate = () => {
    if (newTemplateName.trim() && newTemplateSlug.trim()) {
      onCreateTemplate(newTemplateName.trim(), newTemplateSlug.trim())
      setNewTemplateName('')
      setNewTemplateSlug('')
      setShowCreateForm(false)
    }
  }

  const handleRenameTemplate = () => {
    if (editingTemplate && newTemplateName.trim() && newTemplateSlug.trim()) {
      onRenameTemplate(editingTemplate.id, newTemplateName.trim(), newTemplateSlug.trim())
      setNewTemplateName('')
      setNewTemplateSlug('')
      setEditingTemplate(null)
    }
  }

  const handleCopyTemplate = (template: Template) => {
    const newName = `${template.name} (Copy)`
    const newSlug = `${template.slug}-copy`
    onCreateTemplate(newName, newSlug)
  }

  const handleExportTemplate = (template: Template) => {
    onExportTemplate(template)
  }

  const handleImportTemplate = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    try {
      await onImportTemplate(file)
      alert('Template imported successfully!')
    } catch (err) {
      alert(`Failed to import template: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setIsImporting(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  // Theme-aware styles
  const themeStyles = {
    bg: isDarkTheme ? 'bg-[#1A1A1A]' : 'bg-white',
    border: isDarkTheme ? 'border-[#333333]' : 'border-gray-300',
    text: isDarkTheme ? 'text-gray-200' : 'text-gray-700',
    textSecondary: isDarkTheme ? 'text-gray-400' : 'text-gray-500',
    hover: isDarkTheme ? 'hover:bg-[#2A2A2A]' : 'hover:bg-gray-50',
    selected: isDarkTheme ? 'bg-[#0070F3] text-white' : 'bg-blue-50 text-blue-700',
    button: isDarkTheme ? 'bg-[#2A2A2A] hover:bg-[#3A3A3A]' : 'bg-gray-100 hover:bg-gray-200',
    input: isDarkTheme ? 'bg-[#2A2A2A] border-[#444444] text-gray-200' : 'bg-white border-gray-300 text-gray-700',
    // Dark theme specific overrides for header integration
    headerBg: isDarkTheme ? 'bg-[#0A0A0A]' : 'bg-white',
    headerBorder: isDarkTheme ? 'border-[#333333]' : 'border-gray-300',
    headerHover: isDarkTheme ? 'hover:bg-[#1A1A1A]' : 'hover:bg-gray-50'
  }

  return (
    <div className="relative">
      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImportTemplate}
        className="hidden"
      />

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            className={`inline-flex items-center justify-between rounded px-3 py-1.5 text-sm font-medium leading-none ${themeStyles.headerBg} ${themeStyles.headerBorder} ${themeStyles.text} ${themeStyles.headerHover} focus:outline-none focus:ring-2 focus:ring-[#0070F3] focus:ring-offset-2 ${isDarkTheme ? 'focus:ring-offset-[#0A0A0A]' : 'focus:ring-offset-white'}`}
          >
            <span className="truncate max-w-32">
              {currentTemplate?.name || 'Select Template'}
            </span>
            <ChevronDown className="h-3 w-3 ml-2" />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className={`min-w-[280px] ${themeStyles.bg} ${themeStyles.border} rounded-md shadow-lg p-1 z-50 border-2`}
            sideOffset={4}
            align="start"
          >
            {/* Template List */}
            {templates.map((template) => (
              <div key={template.id} className="group">
                <DropdownMenu.Item
                  className={`relative flex items-center justify-between px-3 py-2 text-sm rounded cursor-pointer ${themeStyles.hover} ${template.id === currentTemplateId ? themeStyles.selected : themeStyles.text}`}
                  onClick={() => onSwitchTemplate(template.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{template.name}</div>
                    <div className={`text-xs truncate ${template.id === currentTemplateId ? 'opacity-80' : themeStyles.textSecondary}`}>
                      {template.slug}
                    </div>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setEditingTemplate(template)
                        setNewTemplateName(template.name)
                        setNewTemplateSlug(template.slug)
                      }}
                      className={`p-1 rounded ${themeStyles.button}`}
                      title="Rename"
                    >
                      <Edit3 className="h-3 w-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCopyTemplate(template)
                      }}
                      className={`p-1 rounded ${themeStyles.button}`}
                      title="Copy"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleExportTemplate(template)
                      }}
                      className={`p-1 rounded ${themeStyles.button}`}
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
                        className="p-1 rounded bg-red-100 hover:bg-red-200 text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                  
                  {template.id === currentTemplateId && (
                    <Check className="h-3 w-3 ml-2" />
                  )}
                </DropdownMenu.Item>
              </div>
            ))}

            {/* Action Buttons */}
            <DropdownMenu.Separator className={`h-px ${isDarkTheme ? 'bg-[#444444]' : 'bg-gray-200'} my-1`} />
            
            <DropdownMenu.Item
              className={`w-full text-left px-3 py-2 text-sm text-green-500 hover:bg-green-500/10 flex items-center disabled:opacity-50 ${themeStyles.hover} cursor-pointer`}
              onClick={triggerFileInput}
              disabled={isImporting}
            >
              <Upload className="h-3 w-3 mr-2" />
              {isImporting ? 'Importing...' : 'Import Template'}
            </DropdownMenu.Item>
            
            <DropdownMenu.Item
              className={`w-full text-left px-3 py-2 text-sm text-blue-500 hover:bg-blue-500/10 flex items-center ${themeStyles.hover} cursor-pointer`}
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              <Plus className="h-3 w-3 mr-2" />
              Create New Template
            </DropdownMenu.Item>

            {/* Create Template Form */}
            {showCreateForm && (
              <div className={`px-3 py-2 border-t ${isDarkTheme ? 'border-[#444444]' : 'border-gray-200'} mt-1`}>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Template Name"
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                    className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-[#0070F3] ${themeStyles.input}`}
                  />
                  <input
                    type="text"
                    placeholder="Template Slug"
                    value={newTemplateSlug}
                    onChange={(e) => setNewTemplateSlug(e.target.value)}
                    className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-[#0070F3] ${themeStyles.input}`}
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCreateTemplate}
                      disabled={!newTemplateName.trim() || !newTemplateSlug.trim()}
                      className="px-3 py-1 text-xs bg-[#0070F3] text-white rounded hover:bg-[#0051CC] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Create
                    </button>
                    <button
                      onClick={() => {
                        setShowCreateForm(false)
                        setNewTemplateName('')
                        setNewTemplateSlug('')
                      }}
                      className={`px-3 py-1 text-xs ${themeStyles.button} ${themeStyles.text}`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Template Form */}
            {editingTemplate && (
              <div className={`px-3 py-2 border-t ${isDarkTheme ? 'border-[#444444]' : 'border-gray-200'} mt-1 ${isDarkTheme ? 'bg-[#2A2A2A]' : 'bg-gray-50'}`}>
                <div className="space-y-2">
                  <div className={`text-xs font-medium ${themeStyles.textSecondary}`}>Edit Template</div>
                  <input
                    type="text"
                    placeholder="Template Name"
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                    className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-[#0070F3] ${themeStyles.input}`}
                  />
                  <input
                    type="text"
                    placeholder="Template Slug"
                    value={newTemplateSlug}
                    onChange={(e) => setNewTemplateSlug(e.target.value)}
                    className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-[#0070F3] ${themeStyles.input}`}
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleRenameTemplate}
                      disabled={!newTemplateName.trim() || !newTemplateSlug.trim()}
                      className="px-3 py-1 text-xs bg-[#0070F3] text-white rounded hover:bg-[#0051CC] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingTemplate(null)
                        setNewTemplateName('')
                        setNewTemplateSlug('')
                      }}
                      className={`px-3 py-1 text-xs ${themeStyles.button} ${themeStyles.text}`}
                    >
                      Cancel
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
