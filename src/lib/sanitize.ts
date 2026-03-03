/**
 * HTML Sanitization Utility
 * 
 * Uses isomorphic-dompurify for server-side and client-side HTML sanitization.
 * This replaces the disabled DOMPurify implementation that was causing JSDOM crashes.
 * 
 * isomorphic-dompurify works in both Node.js and browser environments without
 * requiring JSDOM, making it ideal for Next.js server-side operations.
 */

import DOMPurify from 'isomorphic-dompurify'

/**
 * Sanitize HTML content to prevent XSS attacks
 * Allows safe HTML tags while removing potentially dangerous scripts and styles
 * 
 * @param html - Raw HTML string to sanitize
 * @returns Sanitized HTML string safe for display
 */
export function sanitizeHtml(html: string): string {
  if (!html) return ''

  // Configure DOMPurify with a whitelist of allowed tags and attributes
  const config = {
    ALLOWED_TAGS: [
      'p',
      'br',
      'strong',
      'b',
      'em',
      'i',
      'u',
      'a',
      'ul',
      'ol',
      'li',
      'blockquote',
      'code',
      'pre',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'img',
      'table',
      'thead',
      'tbody',
      'tr',
      'td',
      'th',
      'hr',
      'div',
      'span',
    ],
    ALLOWED_ATTR: [
      'href',
      'title',
      'target',
      'rel',
      'src',
      'alt',
      'width',
      'height',
      'class',
      'id',
    ],
    ALLOW_DATA_ATTR: false,
    FORCE_BODY: false,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
    RETURN_DOM_IMPORT: false,
  }

  return DOMPurify.sanitize(html, config)
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

  // Remove all HTML tags and entities
  return DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
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
