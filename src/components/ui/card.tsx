import * as React from 'react'

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`rounded-xl border border-stone-200 bg-white text-stone-900 shadow-xs ${className}`}
      {...props}
    />
  )
)

Card.displayName = 'Card'

