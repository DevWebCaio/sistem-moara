"use client"

import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { forwardRef } from "react"

interface LoadingButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
  loading?: boolean
  children: React.ReactNode
}

export const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ loading = false, children, disabled, ...props }, ref) => {
    return (
      <Button ref={ref} disabled={disabled || loading} {...props}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </Button>
    )
  }
)

LoadingButton.displayName = "LoadingButton" 