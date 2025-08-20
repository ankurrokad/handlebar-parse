'use client'

import { motion } from 'framer-motion'
import { Code2 } from 'lucide-react'

export function Loading() {
  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mb-4"
        >
          <Code2 className="h-12 w-12 text-[#0070F3]" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-500 text-sm"
        >
          Loading...
        </motion.div>
      </motion.div>
    </div>
  )
}
