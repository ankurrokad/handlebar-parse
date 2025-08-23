export const handleImport = (
  type: 'template' | 'data' | 'layout' | 'styles',
  onImport: (content: string) => void
) => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = type === 'template' ? '.hbs,.html,.txt' : 
                 type === 'data' ? '.json,.txt' : 
                 type === 'styles' ? '.css,.txt' : '.html,.hbs,.txt'
  
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        onImport(content)
      }
      reader.readAsText(file)
    }
  }
  
  input.click()
}

export const handleCopyHtml = async (html: string) => {
  try {
    await navigator.clipboard.writeText(html)
    // You could add a toast notification here if you want
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = html
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
  }
}

export const handleCopyContent = async (content: string) => {
  try {
    await navigator.clipboard.writeText(content)
    // You could add a toast notification here if you want
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = content
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
  }
}
