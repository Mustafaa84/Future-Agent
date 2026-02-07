'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ToolLogo from '@/components/ToolLogo';

interface ToolComparisonProps {
    toolA: {
        slug?: string;
        name: string;
        logo: string;
        rating: number;
        cta: string;
        pros?: string[];
        cons?: string[];
        pricing?: string;
        useCases?: string[];
        integrations?: string[];
        subscriptionDetails?: string;
    };
    toolB: {
        slug?: string;
        name: string;
        logo: string;
        rating: number;
        cta: string;
        pros?: string[];
        cons?: string[];
        pricing?: string;
        useCases?: string[];
        integrations?: string[];
        subscriptionDetails?: string;
    };
    verdict: {
        winner: 'toolA' | 'toolB' | 'tie';
        summary: string;
    };
    features: {
        name: string;
        toolAValue: string;
        toolBValue: string;
    }[];
}

export default function ComparisonPost({ toolA, toolB, verdict, features }: ToolComparisonProps) {
    const [copied, setCopied] = useState(false);

    const handleShare = () => {
        if (typeof window === 'undefined') return;
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const winner = verdict.winner === 'toolA' ? toolA : verdict.winner === 'toolB' ? toolB : null;

    const isValidUrl = (url: string) => {
        if (!url) return false;
        return url.startsWith('http') || url.startsWith('https') || url.startsWith('/');
    };

    const ComparisonToolLogo = ({ tool, color, size = 'large' }: { tool: { logo: string; name: string }, color: string, size?: 'small' | 'large' }) => {
        const dimensions = size === 'small' ? 'w-12 h-12' : 'w-20 h-20 md:w-24 md:h-24';
        const borderColor = color === 'cyan' ? 'border-cyan-400/30' : 'border-purple-400/30';

        return (
            <ToolLogo
                name={tool.name}
                logo={tool.logo}
                className={`${dimensions} rounded-2xl border ${borderColor} shadow-2xl ring-1 ring-white/10`}
                iconClassName={size === 'small' ? 'text-lg' : 'text-3xl'}
            />
        );
    };

    return (
        <div className="mx-auto space-y-8 md:space-y-12 mt-0 mb-8 md:mb-16 px-4">
            {/* Hero Battle Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-white/10 shadow-2xl">
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-purple-500/10" />
                    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                </div>

                <div className="relative p-8 md:p-12">
                    {/* Title Badge */}
                    <div className="flex justify-center mb-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-white/10">
                            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">HEAD-TO-HEAD COMPARISON</span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 items-center">
                        {/* Tool A */}
                        <div className="flex flex-col items-center text-center space-y-4">
                            <ComparisonToolLogo tool={toolA} color="cyan" />
                            <div className="space-y-2">
                                <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{toolA.name}</h3>
                                <div className="flex items-center justify-center gap-1 text-yellow-400 text-sm">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i}>{i < Math.floor(toolA.rating) ? '★' : '☆'}</span>
                                    ))}
                                    <span className="ml-2 text-slate-400">{toolA.rating}</span>
                                </div>
                            </div>
                            <Link
                                href={toolA.cta}
                                target="_blank"
                                className="w-full md:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white text-sm font-bold uppercase tracking-wide transition-all shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 hover:-translate-y-0.5"
                            >
                                Try {toolA.name}
                            </Link>
                        </div>

                        {/* VS Divider */}
                        <div className="flex flex-col items-center justify-center">
                            <div className="relative">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl">
                                    <div className="w-14 h-14 rounded-full bg-slate-900 flex items-center justify-center">
                                        <span className="text-xl font-black text-white">VS</span>
                                    </div>
                                </div>
                                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur-xl opacity-30 -z-10" />
                            </div>
                        </div>

                        {/* Tool B */}
                        <div className="flex flex-col items-center text-center space-y-4">
                            <ComparisonToolLogo tool={toolB} color="purple" />
                            <div className="space-y-2">
                                <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{toolB.name}</h3>
                                <div className="flex items-center justify-center gap-1 text-yellow-400 text-sm">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i}>{i < Math.floor(toolB.rating) ? '★' : '☆'}</span>
                                    ))}
                                    <span className="ml-2 text-slate-400">{toolB.rating}</span>
                                </div>
                            </div>
                            <Link
                                href={toolB.cta}
                                target="_blank"
                                className="w-full md:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white text-sm font-bold uppercase tracking-wide transition-all shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 hover:-translate-y-0.5"
                            >
                                Try {toolB.name}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Unified Comparison Matrix */}
            <div className="rounded-2xl bg-slate-900/80 border border-white/10 overflow-hidden shadow-xl backdrop-blur ring-1 ring-white/5">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px] border-collapse">
                        <thead>
                            <tr className="bg-slate-950/50 border-b border-white/10">
                                <th className="w-1/4 px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Feature</th>
                                <th className="w-[37.5%] px-4 py-3 text-left border-l border-white/5">
                                    <div className="flex items-center gap-2">
                                        <ComparisonToolLogo tool={toolA} color="cyan" size="small" />
                                        <span className="font-bold text-white text-base">{toolA.name}</span>
                                    </div>
                                </th>
                                <th className="w-[37.5%] px-4 py-3 text-left border-l border-white/5">
                                    <div className="flex items-center gap-2">
                                        <ComparisonToolLogo tool={toolB} color="purple" size="small" />
                                        <span className="font-bold text-white text-base">{toolB.name}</span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {/* Rating */}
                            <tr className="hover:bg-white/[0.02]">
                                <td className="px-4 py-3 text-sm font-bold text-slate-300 bg-slate-800/20">Overall Rating</td>
                                <td className="px-4 py-3 border-l border-white/5">
                                    <div className="flex items-center gap-1 text-yellow-400 font-bold text-xs">
                                        <span className="text-base">★</span> {toolA.rating} / 5
                                    </div>
                                </td>
                                <td className="px-4 py-3 border-l border-white/5">
                                    <div className="flex items-center gap-1 text-yellow-400 font-bold text-xs">
                                        <span className="text-base">★</span> {toolB.rating} / 5
                                    </div>
                                </td>
                            </tr>

                            {/* Pricing */}
                            <tr className="hover:bg-white/[0.02]">
                                <td className="px-4 py-3 text-sm font-bold text-slate-300 bg-slate-800/20">Starting Price</td>
                                <td className="px-4 py-3 border-l border-white/5 text-cyan-400 font-bold text-base">
                                    {toolA.pricing || 'Contact Sales'}
                                </td>
                                <td className="px-4 py-3 border-l border-white/5 text-purple-400 font-bold text-base">
                                    {toolB.pricing || 'Contact Sales'}
                                </td>
                            </tr>

                            {/* Pros */}
                            <tr className="hover:bg-white/[0.02]">
                                <td className="px-4 py-3 text-sm font-bold text-slate-300 bg-slate-800/20 align-top">Pros</td>
                                <td className="px-4 py-3 border-l border-white/5 align-top bg-green-500/[0.02]">
                                    <ul className="space-y-1.5">
                                        {toolA.pros?.map((pro, i) => (
                                            <li key={i} className="flex gap-2 text-xs text-slate-300">
                                                <span className="text-green-400 shrink-0">✓</span> {pro}
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td className="px-4 py-3 border-l border-white/5 align-top bg-green-500/[0.02]">
                                    <ul className="space-y-1.5">
                                        {toolB.pros?.map((pro, i) => (
                                            <li key={i} className="flex gap-2 text-xs text-slate-300">
                                                <span className="text-green-400 shrink-0">✓</span> {pro}
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                            </tr>

                            {/* Cons */}
                            <tr className="hover:bg-white/[0.02]">
                                <td className="px-4 py-3 text-sm font-bold text-slate-300 bg-slate-800/20 align-top">Cons</td>
                                <td className="px-4 py-3 border-l border-white/5 align-top bg-red-500/[0.02]">
                                    <ul className="space-y-1.5">
                                        {toolA.cons?.map((con, i) => (
                                            <li key={i} className="flex gap-2 text-xs text-slate-300">
                                                <span className="text-red-400 shrink-0">×</span> {con}
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td className="px-4 py-3 border-l border-white/5 align-top bg-red-500/[0.02]">
                                    <ul className="space-y-1.5">
                                        {toolB.cons?.map((con, i) => (
                                            <li key={i} className="flex gap-2 text-xs text-slate-300">
                                                <span className="text-red-400 shrink-0">×</span> {con}
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                            </tr>

                            {/* Subscription Details */}
                            <tr className="hover:bg-white/[0.02]">
                                <td className="px-4 py-3 text-sm font-bold text-slate-300 bg-slate-800/20">Subscription</td>
                                <td className="px-4 py-3 border-l border-white/5 text-slate-300 text-xs">
                                    {toolA.subscriptionDetails || toolA.pricing || 'No details available'}
                                </td>
                                <td className="px-4 py-3 border-l border-white/5 text-slate-300 text-xs">
                                    {toolB.subscriptionDetails || toolB.pricing || 'No details available'}
                                </td>
                            </tr>

                            {/* Use Cases */}
                            {(toolA.useCases?.length || toolB.useCases?.length) ? (
                                <tr className="hover:bg-white/[0.02]">
                                    <td className="px-4 py-3 text-sm font-bold text-slate-300 bg-slate-800/20">Best Use Cases</td>
                                    <td className="px-4 py-3 border-l border-white/5">
                                        <div className="flex flex-wrap gap-1.5">
                                            {toolA.useCases?.map((tag, i) => (
                                                <span key={i} className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 border border-white/10">{tag}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border-l border-white/5">
                                        <div className="flex flex-wrap gap-1.5">
                                            {toolB.useCases?.map((tag, i) => (
                                                <span key={i} className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 border border-white/10">{tag}</span>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            ) : null}

                            {/* Integrations */}
                            <tr className="hover:bg-white/[0.02]">
                                <td className="px-4 py-3 text-sm font-bold text-slate-300 bg-slate-800/20">Integrations</td>
                                <td className="px-4 py-3 border-l border-white/5">
                                    {(toolA.integrations && toolA.integrations.length > 0) ? (
                                        <div className="flex flex-wrap gap-1.5">
                                            {toolA.integrations.map((tag, i) => (
                                                <span key={i} className="px-1.5 py-0.5 rounded bg-pink-500/10 text-[10px] text-pink-300 border border-pink-500/20">{tag}</span>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-xs text-slate-400 italic">See website for details</span>
                                    )}
                                </td>
                                <td className="px-4 py-3 border-l border-white/5">
                                    {(toolB.integrations && toolB.integrations.length > 0) ? (
                                        <div className="flex flex-wrap gap-1.5">
                                            {toolB.integrations.map((tag, i) => (
                                                <span key={i} className="px-1.5 py-0.5 rounded bg-pink-500/10 text-[10px] text-pink-300 border border-pink-500/20">{tag}</span>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-xs text-slate-400 italic">See website for details</span>
                                    )}
                                </td>
                            </tr>

                            {/* Dynamic Features */}
                            {features.map((feature, idx) => (
                                <tr key={idx} className="hover:bg-white/[0.02]">
                                    <td className="px-4 py-3 text-sm font-bold text-slate-300 bg-slate-800/20">{feature.name}</td>
                                    <td className="px-4 py-3 border-l border-white/5 text-xs text-slate-300">{feature.toolAValue}</td>
                                    <td className="px-4 py-3 border-l border-white/5 text-xs text-slate-300">{feature.toolBValue}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Verdict Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-white/10 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5" />
                <div className="relative p-8 md:p-10">
                    <div className="flex flex-col items-center justify-center mb-6 gap-3">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">
                            <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider">🏆 Expert Verdict</span>
                        </div>

                        <button
                            onClick={handleShare}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all active:scale-95"
                        >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {copied ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6L15.316 7.342m1.368 1.316a3 3 0 110-2.684m0 2.684l-6.632 3.316m6.632-6L8.684 10.658" />
                                )}
                            </svg>
                            {copied ? 'Copied Battle Link!' : 'Share this Battle'}
                        </button>
                    </div>

                    <div className="text-center space-y-4">
                        <h3 className="text-2xl md:text-3xl font-bold text-white">
                            {verdict.winner === 'tie' ? (
                                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    It's a Tie!
                                </span>
                            ) : (
                                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                                    Winner: {winner?.name}
                                </span>
                            )}
                        </h3>

                        <div className="max-w-3xl mx-auto">
                            <p className="text-base md:text-lg text-slate-300 leading-relaxed">
                                {verdict.summary}
                            </p>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                            <Link
                                href={toolA.cta}
                                target="_blank"
                                className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white text-sm font-bold uppercase tracking-wide transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                            >
                                Get {toolA.name}
                            </Link>
                            <Link
                                href={toolB.cta}
                                target="_blank"
                                className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white text-sm font-bold uppercase tracking-wide transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                            >
                                Get {toolB.name}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Note */}
            <div className="text-center">
                <p className="text-xs text-slate-500 italic">
                    Analysis updated for 2026 • Based on current features and pricing
                </p>
            </div>
        </div>
    );
}
