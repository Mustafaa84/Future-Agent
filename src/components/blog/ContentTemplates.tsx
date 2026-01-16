'use client'

import React, { useState } from 'react'

interface ContentTemplatesProps {
  onInsert: (html: string) => void
}

const templates = [
  // 🔹 HERO / STRUCTURE BLOCKS
  {
    id: 'hero-section',
    label: '📰 Hero Section',
    description: 'Big title, subtitle, and intro paragraph',
    html: `<section style="margin: 32px 0; padding: 24px 20px; border-radius: 12px; background: linear-gradient(135deg,#0f172a,#020617); color:#e5e7eb;">
  <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.12em; margin: 0 0 8px 0; color:#38bdf8;">
    Category · January 2026
  </p>
  <h1 style="font-size: 28px; line-height: 1.3; margin: 0 0 12px 0;">
    Your main article title goes here
  </h1>
  <p style="font-size: 16px; line-height: 1.6; margin: 0 0 12px 0; color:#cbd5f5;">
    Short, compelling introduction that explains what the reader will learn and why it matters to them.
  </p>
</section>`
  },
  {
    id: 'section-heading',
    label: '📌 Section Heading (H2)',
    description: 'H2 + short intro paragraph',
    html: `<section style="margin: 28px 0;">
  <h2 style="font-size: 22px; margin: 0 0 8px 0; color:#0f172a;">
    Section heading goes here
  </h2>
  <p style="margin: 0; color:#4b5563; line-height: 1.7;">
    Brief introduction to this section. Explain what this part will cover in one or two sentences.
  </p>
</section>`
  },
  {
    id: 'subsection-heading',
    label: '📍 Subsection (H3)',
    description: 'H3 + supporting text',
    html: `<section style="margin: 20px 0;">
  <h3 style="font-size: 18px; margin: 0 0 6px 0; color:#111827;">
    Subsection title here
  </h3>
  <p style="margin: 0; color:#4b5563; line-height: 1.7;">
    Supporting explanation or detail related to this subsection topic.
  </p>
</section>`
  },

  // 🔹 MEDIA BLOCKS (IMAGES / VIDEO)
  {
    id: 'image-block',
    label: '🖼️ Image + Caption',
    description: 'Centered image with caption',
    html: `<figure style="margin: 28px 0; text-align: center;">
  <img src="https://your-image-url-here.jpg" alt="Describe the image" style="max-width: 100%; border-radius: 12px; box-shadow: 0 18px 45px rgba(15,23,42,0.45);" />
  <figcaption style="margin-top: 10px; color:#6b7280; font-size: 14px;">
    Short descriptive caption for this image.
  </figcaption>
</figure>`
  },
  {
    id: 'image-two-column',
    label: '🖼️ 2 Images Side-by-Side',
    description: 'Two images in columns',
    html: `<div style="display:grid; grid-template-columns: repeat(auto-fit,minmax(220px,1fr)); gap:16px; margin: 28px 0;">
  <figure style="margin:0; text-align:center;">
    <img src="https://your-image-1-url.jpg" alt="First image" style="width:100%; border-radius: 12px;" />
    <figcaption style="margin-top:8px; color:#6b7280; font-size: 13px;">First image caption</figcaption>
  </figure>
  <figure style="margin:0; text-align:center;">
    <img src="https://your-image-2-url.jpg" alt="Second image" style="width:100%; border-radius: 12px;" />
    <figcaption style="margin-top:8px; color:#6b7280; font-size: 13px;">Second image caption</figcaption>
  </figure>
</div>`
  },
  {
    id: 'video-embed',
    label: '▶️ YouTube Embed',
    description: 'Responsive video iframe block',
    html: `<div style="margin: 28px 0;">
  <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 12px; box-shadow: 0 18px 45px rgba(15,23,42,0.45);">
    <iframe
      src="https://www.youtube.com/embed/VIDEO_ID_HERE"
      title="YouTube video player"
      style="position: absolute; top:0; left:0; width:100%; height:100%; border:0;"
      allowfullscreen
    ></iframe>
  </div>
  <p style="margin-top: 10px; color:#6b7280; font-size: 14px; text-align:center;">
    Optional short description of the video.
  </p>
</div>`
  },

  // 🔹 EXISTING LAYOUT / COMPARISON TEMPLATES
  {
    id: 'comparison-table',
    label: '📊 Comparison Table',
    description: 'Compare features side-by-side',
    html: `<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #2d3748; color: #e2e8f0;">
      <th style="border: 1px solid #4a5568; padding: 12px; text-align: left;">Feature</th>
      <th style="border: 1px solid #4a5568; padding: 12px; text-align: left;">Option A</th>
      <th style="border: 1px solid #4a5568; padding: 12px; text-align: left;">Option B</th>
      <th style="border: 1px solid #4a5568; padding: 12px; text-align: left;">Option C</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #4a5568; padding: 12px; font-weight: 500;">Price</td>
      <td style="border: 1px solid #4a5568; padding: 12px;">$99/month</td>
      <td style="border: 1px solid #4a5568; padding: 12px;">$199/month</td>
      <td style="border: 1px solid #4a5568; padding: 12px;">$299/month</td>
    </tr>
    <tr style="background-color: #1a202c;">
      <td style="border: 1px solid #4a5568; padding: 12px; font-weight: 500;">Features</td>
      <td style="border: 1px solid #4a5568; padding: 12px;">Basic</td>
      <td style="border: 1px solid #4a5568; padding: 12px;">Advanced</td>
      <td style="border: 1px solid #4a5568; padding: 12px;">Premium</td>
    </tr>
    <tr>
      <td style="border: 1px solid #4a5568; padding: 12px; font-weight: 500;">Support</td>
      <td style="border: 1px solid #4a5568; padding: 12px;">Email</td>
      <td style="border: 1px solid #4a5568; padding: 12px;">Email + Chat</td>
      <td style="border: 1px solid #4a5568; padding: 12px;">24/7 Phone</td>
    </tr>
  </tbody>
</table>`
  },
  {
    id: 'pros-cons',
    label: '⚖️ Pros & Cons',
    description: 'List advantages and disadvantages',
    html: `<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
  <div style="background-color: #f0fdf4; border-left: 4px solid #22c55e; padding: 20px; border-radius: 8px;">
    <h3 style="color: #16a34a; margin-top: 0;">✅ Pros</h3>
    <ul style="margin: 0; padding-left: 20px;">
      <li>Easy to use</li>
      <li>Great performance</li>
      <li>Excellent support</li>
      <li>Affordable pricing</li>
    </ul>
  </div>
  <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; border-radius: 8px;">
    <h3 style="color: #991b1b; margin-top: 0;">❌ Cons</h3>
    <ul style="margin: 0; padding-left: 20px;">
      <li>Limited customization</li>
      <li>Steep learning curve</li>
      <li>No offline mode</li>
      <li>Integration challenges</li>
    </ul>
  </div>
</div>`
  },
  {
    id: 'timeline',
    label: '📅 Timeline',
    description: 'Show steps or milestones',
    html: `<div style="margin: 20px 0;">
  <div style="display: flex; gap: 20px; margin-bottom: 20px;">
    <div style="display: flex; flex-direction: column; align-items: center;">
      <div style="width: 40px; height: 40px; background-color: #3b82f6; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">1</div>
      <div style="width: 2px; height: 60px; background-color: #e5e7eb; margin: 10px 0;"></div>
    </div>
    <div>
      <h4 style="margin: 0 0 5px 0;">Step One</h4>
      <p style="margin: 0; color: #6b7280;">Description of the first step in your process</p>
    </div>
  </div>
  
  <div style="display: flex; gap: 20px; margin-bottom: 20px;">
    <div style="display: flex; flex-direction: column; align-items: center;">
      <div style="width: 40px; height: 40px; background-color: #3b82f6; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">2</div>
      <div style="width: 2px; height: 60px; background-color: #e5e7eb; margin: 10px 0;"></div>
    </div>
    <div>
      <h4 style="margin: 0 0 5px 0;">Step Two</h4>
      <p style="margin: 0; color: #6b7280;">Description of the second step</p>
    </div>
  </div>

  <div style="display: flex; gap: 20px;">
    <div style="display: flex; flex-direction: column; align-items: center;">
      <div style="width: 40px; height: 40px; background-color: #3b82f6; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">3</div>
    </div>
    <div>
      <h4 style="margin: 0 0 5px 0;">Step Three</h4>
      <p style="margin: 0; color: #6b7280;">Description of the final step</p>
    </div>
  </div>
</div>`
  },
  {
    id: 'highlight-box',
    label: '💡 Highlight Box',
    description: 'Important tip or insight',
    html: `<div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 20px 0;">
  <h3 style="color: #b45309; margin-top: 0;">💡 Key Insight</h3>
  <p style="color: #78350f; margin: 0;">
    This is an important point that your readers need to know. Make it compelling and actionable.
  </p>
</div>`
  },
  {
    id: 'code-block',
    label: '💻 Code Block',
    description: 'Display code snippet',
    html: `<pre style="background-color: #1f2937; color: #e5e7eb; padding: 20px; border-radius: 8px; overflow-x: auto; margin: 20px 0; font-family: 'Courier New', monospace;"><code>// Example code snippet
function helloWorld() {
  console.log("Hello, World!");
}

helloWorld();
</code></pre>`
  },
  {
    id: 'quote',
    label: '💬 Quote',
    description: 'Pull quote or testimonial',
    html: `<blockquote style="border-left: 4px solid #8b5cf6; padding: 20px; margin: 20px 0; background-color: #f5f3ff; font-style: italic; color: #5b21b6;">
  <p style="margin: 0 0 10px 0;">
    "This is a powerful quote that resonates with your audience. It could be from a customer, industry expert, or research finding."
  </p>
  <p style="margin: 0; font-weight: bold; font-style: normal;">— Source or Attribution</p>
</blockquote>`
  },
  {
    id: 'call-to-action',
    label: '🎯 Call-to-Action',
    description: 'Encourage reader action',
    html: `<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px; text-align: center; margin: 20px 0;">
  <h3 style="margin-top: 0; margin-bottom: 10px;">Ready to Get Started?</h3>
  <p style="margin: 0 0 20px 0; font-size: 16px;">Join thousands of users who are already benefiting from this solution.</p>
  <a href="#" style="background-color: white; color: #667eea; padding: 12px 30px; border-radius: 5px; text-decoration: none; font-weight: bold; display: inline-block;">Get Started Now →</a>
</div>`
  },
  {
    id: 'numbered-list',
    label: '📝 Numbered List',
    description: 'Step-by-step guide',
    html: `<ol style="margin: 20px 0; padding-left: 20px; line-height: 1.8;">
  <li style="margin-bottom: 15px;">
    <strong>First item:</strong> Description and details about the first point
  </li>
  <li style="margin-bottom: 15px;">
    <strong>Second item:</strong> More information and context for this step
  </li>
  <li style="margin-bottom: 15px;">
    <strong>Third item:</strong> Complete your sequence with clear instructions
  </li>
  <li>
    <strong>Fourth item:</strong> Final steps or conclusion
  </li>
</ol>`
  },
  {
    id: 'feature-cards',
    label: '🎨 Feature Cards',
    description: 'Showcase 3 features',
    html: `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0;">
  <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; border-top: 3px solid #3b82f6;">
    <h4 style="margin-top: 0; color: #3b82f6;">🚀 Feature One</h4>
    <p style="margin: 0; color: #6b7280; font-size: 14px;">Brief description of this awesome feature</p>
  </div>
  <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; border-top: 3px solid #10b981;">
    <h4 style="margin-top: 0; color: #10b981;">⚡ Feature Two</h4>
    <p style="margin: 0; color: #6b7280; font-size: 14px;">Explanation of what makes this feature special</p>
  </div>
  <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; border-top: 3px solid #f59e0b;">
    <h4 style="margin-top: 0; color: #f59e0b;">💎 Feature Three</h4>
    <p style="margin: 0; color: #6b7280; font-size: 14px;">Details about this incredible capability</p>
  </div>
</div>`
  },

  // 🔹 INFO / STATUS BOXES
  {
    id: 'info-box',
    label: 'ℹ️ Info Box',
    description: 'Neutral info / note box',
    html: `<div style="margin: 20px 0; padding: 16px 18px; border-radius: 10px; background-color:#eff6ff; border-left: 4px solid #3b82f6;">
  <p style="margin:0; color:#1e3a8a; font-size: 14px;">
    <strong>Note:</strong> Use this box to highlight neutral information or context the reader should keep in mind.
  </p>
</div>`
  },
  {
    id: 'warning-box',
    label: '⚠️ Warning Box',
    description: 'Risks, cautions, limitations',
    html: `<div style="margin: 20px 0; padding: 16px 18px; border-radius: 10px; background-color:#fef2f2; border-left: 4px solid #ef4444;">
  <p style="margin:0; color:#991b1b; font-size: 14px;">
    <strong>Warning:</strong> Clearly explain any important limitation, risk, or caveat the reader must understand.
  </p>
</div>`
  },
  {
    id: 'success-box',
    label: '✅ Success Box',
    description: 'Highlight best practices or wins',
    html: `<div style="margin: 20px 0; padding: 16px 18px; border-radius: 10px; background-color:#ecfdf5; border-left: 4px solid #22c55e;">
  <p style="margin:0; color:#166534; font-size: 14px;">
    <strong>Best practice:</strong> Use this box to highlight recommendations that worked well in real scenarios.
  </p>
</div>`
  },

  // 🔹 CONVERSION / CONCLUSION
  {
    id: 'cta-button-center',
    label: '🔘 Centered Button',
    description: 'Single CTA button',
    html: `<div style="text-align:center; margin: 28px 0;">
  <a href="#"
     style="display:inline-block; padding: 12px 28px; border-radius: 999px; background: linear-gradient(135deg,#06b6d4,#3b82f6); color:white; font-weight:600; text-decoration:none; box-shadow:0 12px 30px rgba(59,130,246,0.45);">
    Get started now →
  </a>
</div>`
  },
  {
    id: 'conclusion',
    label: '🧾 Conclusion Section',
    description: 'Wrap-up paragraph + CTA line',
    html: `<section style="margin: 32px 0 20px 0; padding-top: 8px; border-top: 1px solid #e5e7eb;">
  <h2 style="font-size: 22px; margin: 0 0 8px 0; color:#111827;">
    Final thoughts
  </h2>
  <p style="margin: 0 0 8px 0; color:#4b5563; line-height: 1.7;">
    Summarize the main points and remind the reader of the key takeaway from this article.
  </p>
  <p style="margin: 0; color:#111827; font-weight: 500;">
    If you are ready to act, now is the best time to start.
  </p>
</section>`
  }
]

export default function ContentTemplates({ onInsert }: ContentTemplatesProps) {
  const [showAll, setShowAll] = useState(false)
  const visibleTemplates = showAll ? templates : templates.slice(0, 6)

  return (
    <div className="border-t border-slate-700 pt-6 mt-6 bg-slate-800/30 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-slate-200 mb-2">📋 Quick Insert Templates</h3>
      <p className="text-xs text-slate-400 mb-4">
        Click any template to instantly insert it into your content. Edit it to match your needs.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {visibleTemplates.map((template) => (
          <button
            key={template.id}
            type="button"
            onClick={() => onInsert(template.html)}
            className="flex flex-col p-3 bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-slate-500 rounded-lg text-left transition-all group"
            title={template.description}
          >
            <span className="font-medium text-slate-100 group-hover:text-cyan-400 transition-colors">
              {template.label}
            </span>
            <span className="text-xs text-slate-400 mt-1">{template.description}</span>
          </button>
        ))}
      </div>

      {templates.length > 6 && (
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="mt-4 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          {showAll ? '▼ Show Less' : '▶ Show More Templates'} ({templates.length})
        </button>
      )}
    </div>
  )
}
