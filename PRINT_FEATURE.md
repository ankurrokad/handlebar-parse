# Print Feature with WeazyPrint Integration

## Overview

The HBS Parser now includes a print button in the preview tab that allows users to convert their compiled templates to PDF using the WeazyPrint API.

## Features

- **Print Button**: Located next to the copy button in the preview tab
- **Conditional Display**: Only shows when WeazyPrint URL is configured in settings
- **PDF Generation**: Converts HTML templates to PDF with customizable options
- **Auto-Download**: Automatically downloads generated PDFs
- **Error Handling**: Comprehensive error handling with user feedback

## Setup

1. **Configure WeazyPrint URL**:
   - Click the settings icon (⚙️) in the header
   - Enter your WeazyPrint API endpoint
   - Save settings

2. **Print Template**:
   - Compile your Handlebars template
   - Click the print button (🖨️) in the preview tab
   - PDF will be generated and downloaded automatically

## API Integration

### Request Format

The system sends a POST request to your WeazyPrint endpoint using **FormData** (matching your exact API usage):

```typescript
const data = new FormData()
data.append("html", new Blob([htmlContent], { type: "text/html" }), 
  options?.fileName?.replace(".pdf", ".html") || "document.html"
)

const response = await fetch(weazyPrintUrl, {
  method: 'POST',
  body: data, // FormData with HTML content
})
```

The HTML content is sent as a file attachment with:
- **Field name**: `"html"`
- **Content**: HTML as a Blob with `text/html` MIME type
- **Filename**: Customizable filename (defaults to `document.html`)

### Expected Response

Your WeazyPrint API should return the PDF directly as an **arraybuffer** (binary data), not a JSON response. This matches your existing API usage:

```typescript
const response = await axios.post(
  "https://pdfs.omnivatelehealth.com/api/v1.0/print",
  data,
  {
    headers: data.getHeaders(),
    responseType: "arraybuffer",
  }
);
```

The system will automatically:
1. Receive the PDF as arraybuffer
2. Convert it to a blob
3. Download it to the user's device

## File Structure

- **`lib/utils/weazyPrintUtils.ts`**: Core print functionality and API integration
- **`components/preview/PreviewPanel.tsx`**: Print button UI and integration
- **`lib/hooks/useSettings.ts`**: Settings management for WeazyPrint URL

## Error Handling

The system handles various error scenarios:
- Missing WeazyPrint URL configuration
- API request failures
- PDF generation errors
- Download failures

Users receive clear feedback for any issues encountered during the printing process.

## Customization

You can modify the default print options in `weazyPrintUtils.ts`:
- Page format (A4, Letter, Legal)
- Orientation (portrait/landscape)
- Margins
- Additional WeazyPrint-specific options

## Security Notes

- WeazyPrint URL is stored locally in browser localStorage
- No sensitive data is sent to external services
- HTML content is sent as-is to your configured API endpoint
