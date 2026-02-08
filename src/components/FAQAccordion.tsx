'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface FaqRecord {
    id: string
    question: string
    answer: string
}

interface FAQAccordionProps {
    faqs: FaqRecord[]
}

export default function FAQAccordion({ faqs }: FAQAccordionProps) {
    const [openIndex, setOpenIndex] = useState<string | null>(null)

    const toggleFAQ = (id: string) => {
        setOpenIndex(openIndex === id ? null : id)
    }

    return (
        <div className="space-y-4">
            {faqs.map((faq) => (
                <div
                    key={faq.id}
                    className="rounded-xl border border-slate-800 bg-slate-900/60 transition-all duration-300 hover:border-slate-700"
                >
                    <button
                        onClick={() => toggleFAQ(faq.id)}
                        className="flex w-full items-center justify-between p-6 text-left focus:outline-none"
                        aria-expanded={openIndex === faq.id}
                    >
                        <h3 className="text-lg font-semibold text-white">
                            {faq.question}
                        </h3>
                        <span className={`ml-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition-transform duration-300 ${openIndex === faq.id ? 'rotate-180 bg-cyan-900/50 text-cyan-400' : ''}`}>
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </span>
                    </button>

                    <AnimatePresence>
                        {openIndex === faq.id && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                className="overflow-hidden"
                            >
                                <div className="px-6 pb-6 pt-0">
                                    <p className="leading-relaxed text-slate-400 border-t border-slate-800/50 pt-4">
                                        {faq.answer}
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    )
}
