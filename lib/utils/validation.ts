/**
 * Input validation utilities for security
 */

/**
 * Sanitize template name - remove potentially dangerous characters
 */
export function sanitizeTemplateName(name: string): string {
  // Remove HTML tags and dangerous characters
  return name
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>\"'&]/g, '') // Remove dangerous characters
    .trim()
    .substring(0, 100) // Limit length
}

/**
 * Validate template name - check if it's safe
 */
export function validateTemplateName(name: string): { isValid: boolean; error?: string } {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'Template name cannot be empty' }
  }
  
  if (name.length > 100) {
    return { isValid: false, error: 'Template name too long (max 100 characters)' }
  }
  
  // Check for potentially dangerous patterns
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /data:/i
  ]
  
  for (const pattern of dangerousPatterns) {
    if (pattern.test(name)) {
      return { isValid: false, error: 'Template name contains invalid characters' }
    }
  }
  
  return { isValid: true }
}

/**
 * Sanitize template content - basic HTML sanitization
 */
export function sanitizeTemplateContent(content: string): string {
  // Basic sanitization - remove script tags and dangerous attributes
  return content
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Remove script tags
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // Remove event handlers
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/data:/gi, '') // Remove data: protocol
}

/**
 * Validate JSON data - ensure it's safe
 */
export function validateJsonData(data: string): { isValid: boolean; error?: string } {
  try {
    const parsed = JSON.parse(data)
    
    // Check for circular references
    const seen = new WeakSet()
    const checkCircular = (obj: any): boolean => {
      if (obj && typeof obj === 'object') {
        if (seen.has(obj)) return true
        seen.add(obj)
        
        for (const key in obj) {
          if (checkCircular(obj[key])) return true
        }
      }
      return false
    }
    
    if (checkCircular(parsed)) {
      return { isValid: false, error: 'Data contains circular references' }
    }
    
    return { isValid: true }
  } catch (error) {
    return { isValid: false, error: 'Invalid JSON data' }
  }
}
