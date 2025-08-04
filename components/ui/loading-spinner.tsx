import type React from "react"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface LoadingSpinnerProps extends React.SVGProps<SVGSVGElement> {
  size?: number
}

export function LoadingSpinner({ size = 24, className, ...props }: LoadingSpinnerProps) {
  return <Loader2 className={cn("animate-spin", className)} size={size} {...props} />
}
