'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#000000] text-gray-200 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full"
          >
            <div className="rounded-lg border border-red-900/50 bg-[#450A0A] p-6">
              <div className="flex items-center space-x-3 text-red-500 mb-4">
                <AlertCircle className="h-6 w-6" />
                <h2 className="text-lg font-semibold">Something went wrong</h2>
              </div>
              <p className="text-sm text-red-400/90 mb-4">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Reload page</span>
              </button>
            </div>
          </motion.div>
        </div>
      )
    }

    return this.props.children
  }
}
