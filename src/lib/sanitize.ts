import DOMPurify from 'isomorphic-dompurify'

/**
 * Secure HTML whitelist for blog content.
 * Allows safe structural/formatting tags but strips scripts, iframes, and event handlers.
 */
const ALLOWED_TAGS = [
    // Structure
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'div', 'span', 'section', 'article',
    'br', 'hr',
    // Lists
    'ul', 'ol', 'li',
    // Formatting
    'strong', 'b', 'em', 'i', 'u', 's', 'mark', 'small', 'sub', 'sup',
    'blockquote', 'pre', 'code',
    // Links & media
    'a', 'img',
    // Tables
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'colgroup', 'col',
    // Comparison widget (embedded JSON data)
    'script',
]

const ALLOWED_ATTR = [
    // Global
    'class', 'id', 'style',
    // Links
    'href', 'target', 'rel',
    // Images
    'src', 'alt', 'width', 'height', 'loading',
    // Tables
    'colspan', 'rowspan', 'scope',
    // Script (for comparison JSON only)
    'type',
]

/**
 * Sanitize rich HTML content (blog posts, tool descriptions).
 * Allows structural tags but strips dangerous elements like event handlers and javascript: URLs.
 */
export function sanitizeHtml(html: string): string {
    if (!html) return ''

    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS,
        ALLOWED_ATTR,
        ALLOW_DATA_ATTR: false,
        // Allow the comparison-data script tag (type="application/json" only)
        FORCE_BODY: true,
    })
}

/**
 * Strip ALL HTML tags – use for plain-text fields like comments, names, emails.
 */
export function sanitizeText(input: string): string {
    if (!input) return ''
    return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }).trim()
}
