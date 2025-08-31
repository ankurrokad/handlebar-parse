export interface EmailCredentials {
  smtpHost: string
  smtpPort: number
  smtpUsername: string
  smtpPassword: string
  fromEmail: string
  fromName?: string
}

export interface EmailRequest {
  to: string
  subject: string
  html: string
  credentials: EmailCredentials
}

export interface EmailResponse {
  success: boolean
  error?: string
}

/**
 * Sends HTML content via email using SMTP credentials
 * This will need to be implemented with a backend service or email service provider
 */
export const sendEmailWithSMTP = async (
  emailRequest: EmailRequest
): Promise<EmailResponse> => {
  try {
    // For now, we'll use a simple approach that could be extended
    // In a real implementation, you'd want to use a backend service or email service provider
    
    // Example: Using a service like SendGrid, Mailgun, or your own SMTP server
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: emailRequest.to,
        subject: emailRequest.subject,
        html: emailRequest.html,
        smtp: {
          host: emailRequest.credentials.smtpHost,
          port: emailRequest.credentials.smtpPort,
          username: emailRequest.credentials.smtpUsername,
          password: emailRequest.credentials.smtpPassword,
          from: emailRequest.credentials.fromEmail,
          fromName: emailRequest.credentials.fromName
        }
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    
    if (result.success) {
      return { success: true }
    } else {
      return { success: false, error: result.error || 'Failed to send email' }
    }
  } catch (error) {
    console.error('Email sending error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }
  }
}

/**
 * Opens a simple email dialog with pre-filled content
 * This is a fallback option when SMTP is not configured
 */
export const openEmailDialog = (html: string, subject: string = 'HBS Parser Output') => {
  const emailBody = encodeURIComponent(html)
  const emailSubject = encodeURIComponent(subject)
  const mailtoLink = `mailto:?subject=${emailSubject}&body=${emailBody}`
  
  window.open(mailtoLink, '_blank')
}
