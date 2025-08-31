import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, subject, html, smtp } = body

    // Validate required fields
    if (!to || !subject || !html || !smtp) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.port === 465, // true for 465, false for other ports
      auth: {
        user: smtp.username,
        pass: smtp.password,
      },
    })

    // Send email
    const info = await transporter.sendMail({
      from: smtp.fromName ? `"${smtp.fromName}" <${smtp.from}>` : smtp.from,
      to: to,
      subject: subject,
      html: html,
    })

    return NextResponse.json({
      success: true,
      messageId: info.messageId
    })

  } catch (error) {
    console.error('Email sending error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to send email' 
      },
      { status: 500 }
    )
  }
}
