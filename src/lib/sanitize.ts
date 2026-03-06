/**
 * HTML Sanitization Utility
 * 
 * Uses sanitize-html for server-side HTML sanitization.
 * This replaces the disabled DOMPurify implementation that was causing JSDOM crashes.
 * 
 * sanitize-html does NOT depend on JSDOM, making it fully compatible with
 * Next.js server-side operations and Vercel deployments.
 */

import sanitize from 'sanitize-html'

/**
 * Sanitize HTML content to prevent XSS attacks
 * Allows safe HTML tags while removing potentially dangerous scripts and styles
 * 
 * @param html - Raw HTML string to sanitize
 * @returns Sanitized HTML string safe for display
 */
export function sanitizeHtml(html: string): string {
  if (!html) return ''

  return sanitize(html, {
    allowedTags: [
      'p', 'br', 'strong', 'b', 'em', 'i', 'u',
      'a', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'img', 'table', 'thead', 'tbody', 'tr', 'td', 'th',
      'hr', 'div', 'span',
    ],
    allowedAttributes: {
      'a': ['href', 'title', 'target', 'rel'],
      'img': ['src', 'alt', 'width', 'height'],
      '*': ['class', 'id'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    disallowedTagsMode: 'discard',
  })
}

/**
 * Sanitize plain text input (removes all HTML tags)
 * Useful for user names, emails, and other text fields
 * 
 * @param text - Raw text string to sanitize
 * @returns Plain text with HTML tags removed
 */
export function sanitizeText(text: string): string {
  if (!text) return ''

  return sanitize(text, {
    allowedTags: [],
    allowedAttributes: {},
  })
}

/**
 * Escape HTML special characters for safe display
 * Use this when you want to display user input as literal text (not HTML)
 * 
 * @param text - Text to escape
 * @returns HTML-escaped text
 */
export function escapeHtml(text: string): string {
  if (!text) return ''

  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }

  return text.replace(/[&<>"']/g, (char) => map[char])
}
