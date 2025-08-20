import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl hover:scale-105 hover:from-blue-700 hover:to-blue-800",
        destructive: "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg hover:shadow-xl hover:scale-105 hover:from-red-700 hover:to-red-800",
        outline: "border-2 border-gray-200 bg-white/50 backdrop-blur-sm text-gray-700 hover:bg-white/80 hover:border-gray-300 hover:scale-105 dark:border-gray-600 dark:bg-gray-800/50 dark:text-gray-200 dark:hover:bg-gray-800/80 dark:hover:border-gray-500",
        secondary: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 shadow-lg hover:shadow-xl hover:scale-105 hover:from-gray-200 hover:to-gray-300 dark:from-gray-700 dark:to-gray-800 dark:text-gray-100 dark:hover:from-gray-600 dark:hover:to-gray-700",
        ghost: "hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100",
        link: "text-blue-600 underline-offset-4 hover:underline dark:text-blue-400",
        glass: "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:scale-105 hover:shadow-lg",
        success: "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg hover:shadow-xl hover:scale-105 hover:from-green-700 hover:to-green-800",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        />
      </motion.div>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
