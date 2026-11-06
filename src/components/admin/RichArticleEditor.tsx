import React, { useState, useRef } from 'react'
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  Link as LinkIcon,
  Minus,
  MessageCircle,
  Sparkles,
  Eye,
  Edit3,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { WHATSAPP_CONCIERGE_NUMBER } from '@/constants/bridalOptions'

interface RichArticleEditorProps {
  value: string
  onChange: (newValue: string) => void
  placeholder?: string
  readingTimeMinutes?: number
}

export const RichArticleEditor: React.FC<RichArticleEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write your bridal journal article here... Use the toolbar above for headings, quotes, and WhatsApp fitting/order CTA buttons.',
  readingTimeMinutes = 4,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isWaModalOpen, setIsWaModalOpen] = useState(false)
  const [waProductName, setWaProductName] = useState('The Aurelia French Lace Ballgown')
  const [waButtonLabel, setWaButtonLabel] = useState('Book Private Fitting via WhatsApp')
  const [waCustomMessage, setWaCustomMessage] = useState(
    'Hello Elinboend Bridal, I read your bridal journal and would like to inquire about'
  )
  const [editorMode, setEditorMode] = useState<'write' | 'preview'>('write')

  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0
  const charCount = value.length

  const insertFormatting = (prefix: string, suffix: string = '', defaultText: string = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end) || defaultText

    const replacement = `${prefix}${selectedText}${suffix}`
    const newValue = value.substring(0, start) + replacement + value.substring(end)

    onChange(newValue)

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length
      )
    }, 50)
  }

  const insertLinePrefix = (prefix: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const lineStart = value.lastIndexOf('\n', start - 1) + 1
    const lineEnd = value.indexOf('\n', start)
    const currentLine = value.substring(lineStart, lineEnd === -1 ? value.length : lineEnd)

    const newLine = `${prefix}${currentLine.replace(/^(\s*#+\s*|\s*[-*]\s*|\s*\d+\.\s*|\s*>\s*)/, '')}`
    const newValue =
      value.substring(0, lineStart) +
      newLine +
      value.substring(lineEnd === -1 ? value.length : lineEnd)

    onChange(newValue)

    setTimeout(() => {
      textarea.focus()
    }, 50)
  }

  const handleInsertWhatsAppCTA = () => {
    const encodedMessage = encodeURIComponent(`${waCustomMessage}: ${waProductName}`)
    const waUrl = `https://wa.me/${WHATSAPP_CONCIERGE_NUMBER}?text=${encodedMessage}`
    const markdownWaBtn = `\n\n[${waButtonLabel}](${waUrl})\n\n`

    const textarea = textareaRef.current
    if (textarea) {
      const start = textarea.selectionStart
      const newValue = value.substring(0, start) + markdownWaBtn + value.substring(start)
      onChange(newValue)
    } else {
      onChange(value + markdownWaBtn)
    }

    setIsWaModalOpen(false)
  }

  return (
    <div className="border border-stone-300 rounded-xl overflow-hidden bg-white shadow-xs">
      {/* Substack-Style Formatting Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-1 p-2 bg-stone-50 border-b border-stone-200">
        <div className="flex flex-wrap items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertFormatting('**', '**', 'bold text')}
            title="Bold"
            className="h-8 px-2 text-stone-700 hover:bg-stone-200 hover:text-stone-900"
          >
            <Bold className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertFormatting('*', '*', 'italic text')}
            title="Italic"
            className="h-8 px-2 text-stone-700 hover:bg-stone-200 hover:text-stone-900"
          >
            <Italic className="w-4 h-4" />
          </Button>

          <div className="h-4 w-px bg-stone-300 mx-1" />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertLinePrefix('## ')}
            title="Heading 2 (H2)"
            className="h-8 px-2 text-xs font-bold text-stone-700 hover:bg-stone-200 hover:text-stone-900"
          >
            <Heading2 className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertLinePrefix('### ')}
            title="Heading 3 (H3)"
            className="h-8 px-2 text-xs font-bold text-stone-700 hover:bg-stone-200 hover:text-stone-900"
          >
            <Heading3 className="w-4 h-4" />
          </Button>

          <div className="h-4 w-px bg-stone-300 mx-1" />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertLinePrefix('> ')}
            title="Editorial Quote"
            className="h-8 px-2 text-stone-700 hover:bg-stone-200 hover:text-stone-900"
          >
            <Quote className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertLinePrefix('- ')}
            title="Bullet List"
            className="h-8 px-2 text-stone-700 hover:bg-stone-200 hover:text-stone-900"
          >
            <List className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertLinePrefix('1. ')}
            title="Numbered List"
            className="h-8 px-2 text-stone-700 hover:bg-stone-200 hover:text-stone-900"
          >
            <ListOrdered className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              insertFormatting('[', '](https://elinboendbridal.com)', 'Explore Gown Collection')
            }
            title="Insert Website Link"
            className="h-8 px-2 text-stone-700 hover:bg-stone-200 hover:text-stone-900"
          >
            <LinkIcon className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertFormatting('\n\n---\n\n')}
            title="Section Divider"
            className="h-8 px-2 text-stone-700 hover:bg-stone-200 hover:text-stone-900"
          >
            <Minus className="w-4 h-4" />
          </Button>

          <div className="h-4 w-px bg-stone-300 mx-1" />

          {/* Instant WhatsApp Concierge CTA Button Builder */}
          <Button
            type="button"
            size="sm"
            onClick={() => setIsWaModalOpen(true)}
            className="h-8 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg gap-1.5 shadow-xs"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>+ WhatsApp Concierge CTA</span>
          </Button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-stone-200 text-xs">
          <button
            type="button"
            onClick={() => setEditorMode('write')}
            className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer ${
              editorMode === 'write'
                ? 'bg-pink-50 text-pink-700 font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" /> Write
          </button>
          <button
            type="button"
            onClick={() => setEditorMode('preview')}
            className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer ${
              editorMode === 'preview'
                ? 'bg-pink-50 text-pink-700 font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Article Preview
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      {editorMode === 'write' ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={14}
          className="w-full p-4 font-sans text-sm text-stone-800 leading-relaxed bg-white focus:outline-none resize-y min-h-[300px]"
        />
      ) : (
        <div className="p-6 bg-stone-50 min-h-[300px] max-h-[500px] overflow-y-auto space-y-3 font-sans text-sm leading-relaxed text-stone-800">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <span className="text-xs font-bold uppercase text-pink-600 tracking-wider">
              Live Bridal Journal Preview
            </span>
            <span className="text-xs text-stone-500 font-mono">
              {wordCount} words | ~{readingTimeMinutes} min read
            </span>
          </div>

          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
            {value ? (
              value.split('\n').map((line, idx) => {
                const trimmed = line.trim()
                if (!trimmed) return <div key={idx} className="h-2" />
                if (trimmed.startsWith('# '))
                  return (
                    <h1 key={idx} className="font-bold text-2xl text-stone-900 border-b pb-2">
                      {trimmed.slice(2)}
                    </h1>
                  )
                if (trimmed.startsWith('## '))
                  return (
                    <h2 key={idx} className="font-bold text-xl text-stone-900 pt-3">
                      {trimmed.slice(3)}
                    </h2>
                  )
                if (trimmed.startsWith('### '))
                  return (
                    <h3 key={idx} className="font-bold text-lg text-stone-900 pt-2">
                      {trimmed.slice(4)}
                    </h3>
                  )
                if (trimmed.startsWith('> '))
                  return (
                    <blockquote
                      key={idx}
                      className="p-3 bg-pink-50 border-l-4 border-pink-500 italic text-stone-800 text-xs rounded-r-lg"
                    >
                      {trimmed.slice(2)}
                    </blockquote>
                  )
                if (trimmed === '---') return <hr key={idx} className="my-4 border-stone-200" />
                if (trimmed.includes('wa.me')) {
                  const match = trimmed.match(/^\[(.*?)\]\((.*?)\)$/)
                  if (match) {
                    return (
                      <div key={idx} className="my-2">
                        <a
                          href={match[2]}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xs hover:bg-emerald-700"
                        >
                          💬 {match[1]}
                        </a>
                      </div>
                    )
                  }
                }
                return (
                  <p key={idx} className="text-stone-700 leading-relaxed text-left">
                    {trimmed}
                  </p>
                )
              })
            ) : (
              <p className="text-stone-400 italic text-center py-8">
                No article content yet. Switch to Write mode to compose your article.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Editor Footer Stats */}
      <div className="flex items-center justify-between px-4 py-2 bg-stone-50 border-t border-stone-200 text-xs text-stone-500 font-mono">
        <div className="flex items-center gap-4">
          <span>
            Words: <strong>{wordCount}</strong>
          </span>
          <span>
            Characters: <strong>{charCount}</strong>
          </span>
        </div>
        <div className="flex items-center gap-1 text-pink-600 font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Bridal Editorial Markdown Editor</span>
        </div>
      </div>

      {/* WhatsApp Concierge CTA Generator Dialog */}
      <Dialog open={isWaModalOpen} onOpenChange={setIsWaModalOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-stone-900">
              <MessageCircle className="w-5 h-5 text-emerald-600" />
              Insert WhatsApp Concierge CTA Button
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <Label className="font-bold text-stone-700">Button Label Text</Label>
              <Input
                value={waButtonLabel}
                onChange={(e) => setWaButtonLabel(e.target.value)}
                placeholder="Book Private Fitting via WhatsApp"
                className="text-xs bg-white border-stone-300"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="font-bold text-stone-700">Gown / Service Reference</Label>
              <Input
                value={waProductName}
                onChange={(e) => setWaProductName(e.target.value)}
                placeholder="The Aurelia French Lace Ballgown"
                className="text-xs bg-white border-stone-300"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="font-bold text-stone-700">Pre-filled Bride Message</Label>
              <Input
                value={waCustomMessage}
                onChange={(e) => setWaCustomMessage(e.target.value)}
                placeholder="Hello Elinboend Bridal, I would like to book a fitting for..."
                className="text-xs bg-white border-stone-300"
              />
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                Live Button Preview (+62 878-8011-1169):
              </span>
              <div className="pt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xs">
                  💬 {waButtonLabel}
                </span>
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsWaModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleInsertWhatsAppCTA}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Insert into Article
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

