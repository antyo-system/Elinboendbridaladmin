import * as React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'default', ...props }, ref) => {
    const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
      default: 'bg-pink-600 text-white hover:bg-pink-700 shadow-xs',
      outline: 'border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 hover:text-stone-900',
      ghost: 'text-stone-600 hover:bg-stone-100 hover:text-stone-900',
      destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-xs',
    }

    const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
      default: 'h-10 px-4 py-2 text-sm',
      sm: 'h-8 px-3 py-1.5 text-xs',
      lg: 'h-11 px-6 py-2.5 text-sm',
      icon: 'h-9 w-9 p-0',
    }

    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300 disabled:pointer-events-none disabled:opacity-50 cursor-pointer ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

