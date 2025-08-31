export interface WeazyPrintRequest {
  html: string
  options?: {
    fileName?: string
    format?: 'A4' | 'Letter' | 'Legal'
    orientation?: 'portrait' | 'landscape'
    margin?: {
      top?: string
      right?: string
      bottom?: string
      left?: string
    }
  }
}

export interface WeazyPrintResponse {
  success: boolean
  error?: string
}

/**
 * Sends HTML content to WeazyPrint API for PDF generation
 * Based on your actual API usage that returns PDF directly as arraybuffer
 */
export const printWithWeazyPrint = async (
  weazyPrintUrl: string,
  html: string,
  options?: WeazyPrintRequest['options']
): Promise<WeazyPrintResponse> => {
  try {
    // Create FormData as per your API usage
    const data = new FormData()
    data.append("html", new Blob([html], { type: "text/html" }), 
      options?.fileName?.replace(".pdf", ".html") || "document.html"
    )

    const response = await fetch(weazyPrintUrl, {
      method: 'POST',
      body: data, // Send FormData directly
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Get the PDF as arraybuffer (matching your axios usage)
    const pdfBuffer = await response.arrayBuffer()
    
    // Convert arraybuffer to blob and download
    const blob = new Blob([pdfBuffer], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `hbs-parser-${new Date().toISOString().slice(0, 10)}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    return { success: true }
  } catch (error) {
    console.error('WeazyPrint API error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }
  }
}
