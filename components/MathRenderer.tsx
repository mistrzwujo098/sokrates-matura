'use client'

import React from 'react'
import 'katex/dist/katex.min.css'
import { InlineMath, BlockMath } from 'react-katex'

interface MathRendererProps {
  content: string
  inline?: boolean
}

export default function MathRenderer({ content, inline = false }: MathRendererProps) {
  // Function to parse and render mixed text/math content
  const renderMixedContent = (text: string) => {
    // Split by $ for inline math and $$ for block math
    const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[^$]*\$)/g)
    
    return parts.map((part, index) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        // Block math
        const math = part.slice(2, -2)
        return <BlockMath key={index} math={math} />
      } else if (part.startsWith('$') && part.endsWith('$')) {
        // Inline math
        const math = part.slice(1, -1)
        return <InlineMath key={index} math={math} />
      } else {
        // Regular text
        return <span key={index}>{part}</span>
      }
    })
  }

  if (inline) {
    return <span className="math-content">{renderMixedContent(content)}</span>
  }

  return <div className="math-content">{renderMixedContent(content)}</div>
}

// Export utility function for detecting math content
export function hasMathContent(text: string): boolean {
  return /\$.*?\$|\$\$[\s\S]*?\$\$/.test(text)
}

// Export utility function for extracting plain text from math content
export function extractPlainText(content: string): string {
  return content.replace(/\$\$[\s\S]*?\$\$/g, '[równanie]').replace(/\$[^$]*\$/g, '[wzór]')
}
