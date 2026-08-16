import type { ReactNode } from 'react'

type LexicalNode = {
  type?: string
  tag?: string
  text?: string
  format?: number
  url?: string
  children?: LexicalNode[]
}

type LexicalDoc = {
  root?: {
    children?: LexicalNode[]
  }
}

function renderText(node: LexicalNode, key: number): ReactNode {
  let text: ReactNode = node.text || ''
  const format = node.format || 0
  if (format & 1) text = <strong key={`b-${key}`}>{text}</strong>
  if (format & 2) text = <em key={`i-${key}`}>{text}</em>
  if (format & 8) text = <u key={`u-${key}`}>{text}</u>
  return text
}

function renderNodes(nodes: LexicalNode[] = []): ReactNode[] {
  return nodes.map((node, i) => {
    const key = `${node.type || 'n'}-${i}`
    if (node.type === 'text') return <span key={key}>{renderText(node, i)}</span>
    if (node.type === 'linebreak') return <br key={key} />
    if (node.type === 'link') {
      return (
        <a key={key} href={node.url || '#'} className="underline">
          {renderNodes(node.children)}
        </a>
      )
    }
    if (node.type === 'paragraph') {
      return (
        <p key={key} className="type-body">
          {renderNodes(node.children)}
        </p>
      )
    }
    if (node.type === 'heading') {
      const Tag = (node.tag || 'h2') as 'h2' | 'h3' | 'h4'
      return (
        <Tag key={key} className="type-title">
          {renderNodes(node.children)}
        </Tag>
      )
    }
    if (node.type === 'list') {
      return (
        <ul key={key} className="my-4 list-disc pl-5">
          {renderNodes(node.children)}
        </ul>
      )
    }
    if (node.type === 'listitem') {
      return <li key={key}>{renderNodes(node.children)}</li>
    }
    if (node.children?.length) {
      return (
        <div key={key}>{renderNodes(node.children)}</div>
      )
    }
    return <span key={key} />
  })
}

export function RichText({ data, className }: { data?: LexicalDoc | null; className?: string }) {
  if (!data?.root?.children?.length) return null
  return <div className={['rich-text', className].filter(Boolean).join(' ')}>{renderNodes(data.root.children)}</div>
}

export function lexicalText(data?: LexicalDoc | null) {
  const walk = (nodes: LexicalNode[] = []): string =>
    nodes
      .map((node) => {
        if (node.text) return node.text
        if (node.children) return walk(node.children)
        return ''
      })
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim()
  return walk(data?.root?.children)
}

export function textToLexical(text: string) {
  const paragraphs = text.split(/\n\n+/).filter(Boolean)
  return {
    root: {
      type: 'root',
      children: paragraphs.map((p) => ({
        type: 'paragraph',
        children: [{ type: 'text', text: p, version: 1 }],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      })),
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}
