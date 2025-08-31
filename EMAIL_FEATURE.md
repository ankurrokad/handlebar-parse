# Email Feature

The HBS Parser now includes an email feature that allows users to send compiled HTML templates via email using SMTP credentials.

## Features

- **Email Button**: Located next to the print button in the preview tab
- **SMTP Configuration**: Configurable SMTP settings in user preferences
- **Fallback Option**: Uses system mail app when SMTP is not configured
- **HTML Support**: Sends HTML content directly in email body

## Setup

### 1. Configure SMTP Settings

1. Click the Settings button (⚙️) in the header
2. Navigate to the "Email Settings (SMTP)" section
3. Fill in your SMTP credentials:
   - **SMTP Host**: Your SMTP server (e.g., `smtp.gmail.com`)
   - **SMTP Port**: Port number (usually 587 for TLS, 465 for SSL)
   - **SMTP Username**: Your email address
   - **SMTP Password**: Your app password or email password
   - **From Email**: Sender email address
   - **From Name**: Sender display name

### 2. Common SMTP Providers

#### Gmail
- Host: `smtp.gmail.com`
- Port: `587` (TLS) or `465` (SSL)
- Username: Your Gmail address
- Password: App password (not your regular password)

#### Outlook/Hotmail
- Host: `smtp-mail.outlook.com`
- Port: `587`
- Username: Your Outlook email
- Password: Your email password

#### Custom SMTP Server
- Host: Your SMTP server address
- Port: Your SMTP server port
- Username: Your SMTP username
- Password: Your SMTP password

## Usage

### Sending Emails

1. Compile your Handlebars template
2. Click the email button (📧) in the preview tab
3. Fill in the email details:
   - **To**: Recipient email address
   - **Subject**: Email subject (defaults to "HBS Parser Output")
   - **Message**: Optional additional message
4. Click "Send Email"

### Fallback Mode

If SMTP is not configured, the email modal will show a "Use Mail App" button that opens your system's default mail application with pre-filled content.

## Technical Details

### API Endpoint

The email feature uses a Next.js API route at `/api/send-email` that:
- Accepts POST requests with email data
- Uses nodemailer for SMTP communication
- Returns success/error responses

### Security Considerations

- SMTP credentials are stored locally in browser storage
- Passwords are not encrypted (consider using environment variables in production)
- The API route validates all input fields
- Error messages are sanitized to prevent information leakage

### Dependencies

- `nodemailer`: For SMTP email sending
- `@types/nodemailer`: TypeScript definitions

## Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Verify your SMTP credentials
   - Check if your email provider requires app passwords
   - Ensure the correct port is used

2. **Connection Timeout**
   - Check your firewall settings
   - Verify the SMTP host and port
   - Try different ports (587 vs 465)

3. **Email Not Received**
   - Check spam/junk folders
   - Verify recipient email address
   - Check SMTP server logs

### Debug Mode

Enable browser console logging to see detailed error messages from the email API.

## Future Enhancements

- Email templates and customization
- Batch email sending
- Email scheduling
- Attachment support
- Email tracking and analytics
- Integration with email marketing services
