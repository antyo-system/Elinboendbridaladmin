import * as React from 'react'
import { X } from 'lucide-react'

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

const DialogContext = React.createContext<{ onClose: () => void }>({
  onClose: () => undefined,
})

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  if (!open) return null

  return (
    <DialogContext.Provider value={{ onClose: () => onOpenChange(false) }}>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4 animate-in fade-in duration-150"
        onClick={() => onOpenChange(false)}
      >
        {children}
      </div>
    </DialogContext.Provider>
  )
}

export function DialogContent({
  className = '',
  children,
}: React.HTMLAttributes<HTMLDivElement>) {
  const { onClose } = React.useContext(DialogContext)

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`relative w-full max-w-lg rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl ${className}`}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors cursor-pointer"
        aria-label="Close modal"
      >
        <X className="h-4 w-4" />
      </button>
      {children}
    </div>
  )
}

export function DialogHeader({
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`flex flex-col space-y-1.5 text-left ${className}`} {...props} />
}

export function DialogTitle({
  className = '',
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={`text-lg font-bold leading-none tracking-tight text-stone-900 ${className}`} {...props} />
}

export function DialogDescription({
  className = '',
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={`text-xs text-stone-500 ${className}`} {...props} />
}

export function DialogFooter({
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`flex flex-row justify-end gap-2 pt-3 ${className}`} {...props} />
}

