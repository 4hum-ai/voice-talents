/**
 * Markdown parsing and processing utilities
 */

import { marked } from 'marked'

/**
 * Configure marked options
 */
export function configureMarked() {
  marked.setOptions({
    breaks: true,
    gfm: true,
  })
}

// Initialize marked configuration
configureMarked()

/**
 * Parse markdown to HTML
 */
export function parseMarkdown(markdown: string): string {
  return marked.parse(markdown) as string
}

/**
 * Extract H1 title from HTML string
 */
export function extractTitle(html: string): string | null {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const h1 = doc.querySelector('h1')
  return h1?.textContent?.trim() || null
}

/**
 * Remove H1 element from HTML string
 */
export function removeH1(html: string): string {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const h1 = doc.querySelector('h1')
  if (h1) {
    h1.remove()
  }
  return doc.body.innerHTML
}

/**
 * Extract title and optionally remove H1 from HTML
 */
export function processContentHtml(
  html: string,
  options: { extractTitle?: boolean; removeH1?: boolean } = {},
): { html: string; title: string | null } {
  const { extractTitle: shouldExtract = true, removeH1: shouldRemove = true } = options

  let processedHtml = html
  let title: string | null = null

  if (shouldExtract) {
    title = extractTitle(html)
  }

  if (shouldRemove && title) {
    processedHtml = removeH1(html)
  }

  return { html: processedHtml, title }
}

/**
 * Parse frontmatter from markdown (if present)
 * Supports YAML frontmatter format: ---\nkey: value\n---
 */
export function parseFrontmatter(markdown: string): {
  frontmatter: Record<string, unknown>
  content: string
} {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
  const match = markdown.match(frontmatterRegex)

  if (!match) {
    return { frontmatter: {}, content: markdown }
  }

  const frontmatterText = match[1]
  const content = match[2]

  // Simple YAML parsing (basic key: value pairs)
  const frontmatter: Record<string, unknown> = {}
  const lines = frontmatterText.split('\n')

  for (const line of lines) {
    const colonIndex = line.indexOf(':')
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim()
      const value = line.slice(colonIndex + 1).trim()
      // Remove quotes if present
      frontmatter[key] = value.replace(/^["']|["']$/g, '')
    }
  }

  return { frontmatter, content }
}
