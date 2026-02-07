// ✅ WORKING SOLUTION: Force JSON output by making it simpler
// This version uses a clearer prompt that forces JSON format

import { NextRequest, NextResponse } from 'next/server'

interface PerplexityApiResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

interface GeneratedContent {
  content: string
  excerpt: string
  meta_title: string
  meta_description: string
  tags: string[]
  reading_time: number
  featured_image_suggestion?: string
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''
    const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY

    if (!PERPLEXITY_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'Missing PERPLEXITY_API_KEY in .env.local' },
        { status: 500 }
      )
    }

    // BLOG FLOW (FormData only)
    if (
      contentType.includes('multipart/form-data') ||
      contentType.includes('application/x-www-form-urlencoded')
    ) {
      const formData = await request.formData()
      const title = formData.get('title') as string
      const category = formData.get('category') as string
      const keywords = formData.get('keywords') as string
      const tone = (formData.get('tone') as string) || 'neutral'
      const length = (formData.get('length') as string) || 'standard'

      if (!title || !category) {
        return NextResponse.json(
          { success: false, error: 'Title and category required for blog posts' },
          { status: 400 }
        )
      }

      // ✅ SIMPLIFIED PROMPT - Forces JSON more effectively
      const systemPrompt = `You are an expert SEO content writer. Your ONLY job is to return valid JSON. Nothing else.

REQUIREMENTS:
- Return ONLY valid JSON
- NO markdown, NO explanations, NO code blocks
- HTML content must have: <h2>, <h3>, <p>, <strong>, <ul><li>, <a> tags
- NO [1][2] citations
- Escape all quotes in JSON strings with backslash`

      const userPrompt = `Write a blog post and return ONLY this JSON (no other text):

{
  "content": "<h2>Introduction</h2><p>CONTENT HERE...</p>",
  "excerpt": "150-160 character summary",
  "meta_title": "50-60 character title",
  "meta_description": "150-160 character description",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "reading_time": 8,
  "featured_image_suggestion": "Image description for stock photos"
}

${length === 'comparison' ? `
SPECIAL INSTRUCTION FOR COMPARISON:
This is a side-by-side battle. Your 'content' field MUST start with a <script type="application/json" id="comparison-data"> block.
Inside that script, provide a JSON object with this EXACT structure:
{
  "toolA": { "name": "Name", "logo": "URL or emoji", "rating": 4.8, "cta": "URL" },
  "toolB": { "name": "Name", "logo": "URL or emoji", "rating": 4.5, "cta": "URL" },
  "verdict": { "winner": "toolA", "summary": "Reasoning for winner" },
  "features": [
    { "name": "Feature Name", "toolAValue": "Value", "toolBValue": "Value" }
  ]
}
Research the tools in the title to provide ACCURATE ratings and feature values.
After the </script> block, continue with the normal HTML article (h2, p, etc.) analyzing the comparison.` : ''}

Blog Details:
Title: "${title}"
Category: ${category}
Keywords: ${keywords || 'general'}
Tone: ${tone}
Length: ${length}

IMPORTANT: Return ONLY the JSON object. Nothing before or after.`

      const apiRes = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'sonar-pro',
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            {
              role: 'user',
              content: userPrompt,
            },
          ],
          max_tokens: 6000,
          temperature: 0.7,
        }),
      })

      const text = await apiRes.text()

      if (!apiRes.ok) {
        console.error('Perplexity API error:', text)
        return NextResponse.json(
          { success: false, error: `Perplexity API error: ${apiRes.status}` },
          { status: 500 }
        )
      }

      // ✅ PARSE PERPLEXITY RESPONSE
      let content: string
      try {
        const apiData: PerplexityApiResponse = JSON.parse(text)
        content = apiData?.choices?.[0]?.message?.content || ''
      } catch (parseErr) {
        console.error('Failed to parse API response:', parseErr)
        return NextResponse.json(
          { success: false, error: 'Invalid response from Perplexity API' },
          { status: 500 }
        )
      }

      if (!content) {
        return NextResponse.json(
          { success: false, error: 'Empty response from API' },
          { status: 500 }
        )
      }

      // ✅ EXTRACT JSON - More aggressive extraction
      let parsed: GeneratedContent
      try {
        let clean = content
          .replace(/```json\n?/g, '')
          .replace(/```\n?/g, '')
          .trim()

        // Find first { and last }
        const firstBrace = clean.indexOf('{')
        const lastBrace = clean.lastIndexOf('}')

        if (firstBrace === -1 || lastBrace === -1) {
          console.error('❌ No JSON found in response')
          console.error('Response was:', content.substring(0, 500))

          // If no JSON, return error with suggestion
          return NextResponse.json(
            {
              success: false,
              error:
                'Perplexity returned content instead of JSON. This might mean the API is confused. Try again with a simpler title.',
              debug: content.substring(0, 200),
            },
            { status: 500 }
          )
        }

        clean = clean.substring(firstBrace, lastBrace + 1)

        // Handle incomplete JSON
        if (!clean.endsWith('}')) {
          const lastCompleteBrace = clean.lastIndexOf('}')
          if (lastCompleteBrace > 0) {
            clean = clean.substring(0, lastCompleteBrace + 1)
          }
        }

        parsed = JSON.parse(clean) as GeneratedContent
        console.log('✅ JSON parsed successfully')
      } catch (jsonErr) {
        console.error('❌ JSON parse error:', jsonErr)
        return NextResponse.json(
          { success: false, error: 'Failed to parse JSON response. Try again.' },
          { status: 500 }
        )
      }

      // ✅ VALIDATE REQUIRED FIELDS
      const required = [
        'content',
        'excerpt',
        'meta_title',
        'meta_description',
        'tags',
        'reading_time',
      ]
      const missing = required.filter((f) => !(f in parsed))
      if (missing.length > 0) {
        return NextResponse.json(
          { success: false, error: `Missing fields: ${missing.join(', ')}` },
          { status: 500 }
        )
      }

      // ✅ VALIDATE HTML STRUCTURE
      const contentStr = String(parsed.content || '')
      const h2Count = (contentStr.match(/<h2>/g) || []).length
      const pCount = (contentStr.match(/<p>/g) || []).length
      const listCount = (contentStr.match(/<ul>/g) || []).length

      console.log(
        `✅ Generated: ${h2Count} h2s, ${pCount} paragraphs, ${listCount} lists`
      )

      if (contentStr.length < 300) {
        return NextResponse.json(
          { success: false, error: 'Content too short. Try again.' },
          { status: 500 }
        )
      }

      // ✅ RETURN SUCCESS
      return NextResponse.json({
        success: true,
        content: contentStr,
        excerpt: String(parsed.excerpt || '').slice(0, 160),
        meta_title: String(parsed.meta_title || '').slice(0, 60),
        meta_description: String(parsed.meta_description || '').slice(0, 160),
        tags: Array.isArray(parsed.tags)
          ? parsed.tags.map((t) => String(t).trim())
          : [],
        reading_time: Math.max(
          1,
          Math.min(60, parseInt(String(parsed.reading_time), 10) || 5)
        ),
        featured_image_suggestion: String(
          parsed.featured_image_suggestion || ''
        ),
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid request' },
      { status: 400 }
    )
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    console.error('Error:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Unknown error' },
      { status: 500 }
    )
  }
}
