'use server'

import { createAdminClient } from '@/lib/supabase'

/* eslint-disable @typescript-eslint/no-explicit-any */


// ─────────────────────────────────────────────
// PRICING PLANS
// ─────────────────────────────────────────────

export async function addPricingPlan(toolId: string, plan: any) {
    const supabase = createAdminClient()
    const { data, error } = await supabase
        .from('tool_pricing_plans')
        .insert([{ ...plan, tool_id: toolId }])
        .select()
        .single()
    if (error) throw new Error(error.message)
    return data
}

export async function updatePricingPlan(id: string, fields: any) {
    const supabase = createAdminClient()
    const { error } = await supabase
        .from('tool_pricing_plans')
        .update(fields)
        .eq('id', id)
    if (error) throw new Error(error.message)
}

export async function deletePricingPlan(id: string) {
    const supabase = createAdminClient()
    const { error } = await supabase
        .from('tool_pricing_plans')
        .delete()
        .eq('id', id)
    if (error) throw new Error(error.message)
}

export async function reorderPricingPlans(items: { id: string; sort_order: number }[]) {
    const supabase = createAdminClient()
    await Promise.all(
        items.map((item) =>
            supabase.from('tool_pricing_plans').update({ sort_order: item.sort_order }).eq('id', item.id)
        )
    )
}

// ─────────────────────────────────────────────
// FAQs
// ─────────────────────────────────────────────

export async function addFaq(toolId: string, faq: any) {
    const supabase = createAdminClient()
    const { data, error } = await supabase
        .from('tool_faqs')
        .insert([{ ...faq, tool_id: toolId }])
        .select()
        .single()
    if (error) throw new Error(error.message)
    return data
}

export async function updateFaq(id: string, fields: any) {
    const supabase = createAdminClient()
    const { error } = await supabase
        .from('tool_faqs')
        .update(fields)
        .eq('id', id)
    if (error) throw new Error(error.message)
}

export async function deleteFaq(id: string) {
    const supabase = createAdminClient()
    const { error } = await supabase
        .from('tool_faqs')
        .delete()
        .eq('id', id)
    if (error) throw new Error(error.message)
}

export async function reorderFaqs(items: { id: string; sort_order: number }[]) {
    const supabase = createAdminClient()
    await Promise.all(
        items.map((item) =>
            supabase.from('tool_faqs').update({ sort_order: item.sort_order }).eq('id', item.id)
        )
    )
}

// ─────────────────────────────────────────────
// ALTERNATIVES
// ─────────────────────────────────────────────

export async function addAlternative(toolId: string, alt: any) {
    const supabase = createAdminClient()
    const { data, error } = await supabase
        .from('tool_alternatives')
        .insert([{ ...alt, tool_id: toolId }])
        .select()
        .single()
    if (error) throw new Error(error.message)
    return data
}

export async function updateAlternative(id: string, fields: any) {
    const supabase = createAdminClient()
    const { error } = await supabase
        .from('tool_alternatives')
        .update(fields)
        .eq('id', id)
    if (error) throw new Error(error.message)
}

export async function deleteAlternative(id: string) {
    const supabase = createAdminClient()
    const { error } = await supabase
        .from('tool_alternatives')
        .delete()
        .eq('id', id)
    if (error) throw new Error(error.message)
}

export async function reorderAlternatives(items: { id: string; sort_order: number }[]) {
    const supabase = createAdminClient()
    await Promise.all(
        items.map((item) =>
            supabase.from('tool_alternatives').update({ sort_order: item.sort_order }).eq('id', item.id)
        )
    )
}

// ─────────────────────────────────────────────
// COMPARISON TABLE
// ─────────────────────────────────────────────

export async function addComparisonRow(toolId: string, row: any) {
    const supabase = createAdminClient()
    const { data, error } = await supabase
        .from('tool_comparisons')
        .insert([{ ...row, tool_id: toolId }])
        .select()
        .single()
    if (error) throw new Error(error.message)
    return data
}

export async function updateComparisonRow(id: string, fields: any) {
    const supabase = createAdminClient()
    const { error } = await supabase
        .from('tool_comparisons')
        .update(fields)
        .eq('id', id)
    if (error) throw new Error(error.message)
}

export async function deleteComparisonRow(id: string) {
    const supabase = createAdminClient()
    const { error } = await supabase
        .from('tool_comparisons')
        .delete()
        .eq('id', id)
    if (error) throw new Error(error.message)
}

export async function reorderComparisonRows(items: { id: string; sort_order: number }[]) {
    const supabase = createAdminClient()
    await Promise.all(
        items.map((item) =>
            supabase.from('tool_comparisons').update({ sort_order: item.sort_order }).eq('id', item.id)
        )
    )
}

// ─────────────────────────────────────────────
// INTEGRATIONS
// ─────────────────────────────────────────────

export async function addIntegration(toolId: string, integration: any) {
    const supabase = createAdminClient()
    const { data, error } = await supabase
        .from('tool_integrations')
        .insert([{ ...integration, tool_id: toolId }])
        .select()
        .single()
    if (error) throw new Error(error.message)
    return data
}

export async function updateIntegration(id: string, fields: any) {
    const supabase = createAdminClient()
    const { error } = await supabase
        .from('tool_integrations')
        .update(fields)
        .eq('id', id)
    if (error) throw new Error(error.message)
}

export async function deleteIntegration(id: string) {
    const supabase = createAdminClient()
    const { error } = await supabase
        .from('tool_integrations')
        .delete()
        .eq('id', id)
    if (error) throw new Error(error.message)
}

export async function reorderIntegrations(items: { id: string; sort_order: number }[]) {
    const supabase = createAdminClient()
    await Promise.all(
        items.map((item) =>
            supabase.from('tool_integrations').update({ sort_order: item.sort_order }).eq('id', item.id)
        )
    )
}

// ─────────────────────────────────────────────
// FEATURES
// ─────────────────────────────────────────────

export async function addFeature(toolId: string, feature: any) {
    const supabase = createAdminClient()
    const { data, error } = await supabase
        .from('tool_features')
        .insert([{ ...feature, tool_id: toolId }])
        .select()
        .single()
    if (error) throw new Error(error.message)
    return data
}

export async function updateFeature(id: string, fields: any) {
    const supabase = createAdminClient()
    const { error } = await supabase
        .from('tool_features')
        .update(fields)
        .eq('id', id)
    if (error) throw new Error(error.message)
}

export async function deleteFeature(id: string) {
    const supabase = createAdminClient()
    const { error } = await supabase
        .from('tool_features')
        .delete()
        .eq('id', id)
    if (error) throw new Error(error.message)
}

export async function reorderFeatures(items: { id: string; sort_order: number }[]) {
    const supabase = createAdminClient()
    await Promise.all(
        items.map((item) =>
            supabase.from('tool_features').update({ sort_order: item.sort_order }).eq('id', item.id)
        )
    )
}

// ─────────────────────────────────────────────
// PROS
// ─────────────────────────────────────────────

export async function addPro(toolId: string, pro: any) {
    const supabase = createAdminClient()
    const { data, error } = await supabase
        .from('tool_pros')
        .insert([{ ...pro, tool_id: toolId }])
        .select()
        .single()
    if (error) throw new Error(error.message)
    return data
}

export async function updatePro(id: string, fields: any) {
    const supabase = createAdminClient()
    const { error } = await supabase
        .from('tool_pros')
        .update(fields)
        .eq('id', id)
    if (error) throw new Error(error.message)
}

export async function deletePro(id: string) {
    const supabase = createAdminClient()
    const { error } = await supabase
        .from('tool_pros')
        .delete()
        .eq('id', id)
    if (error) throw new Error(error.message)
}

export async function reorderPros(items: { id: string; sort_order: number }[]) {
    const supabase = createAdminClient()
    await Promise.all(
        items.map((item) =>
            supabase.from('tool_pros').update({ sort_order: item.sort_order }).eq('id', item.id)
        )
    )
}

// ─────────────────────────────────────────────
// CONS
// ─────────────────────────────────────────────

export async function addCon(toolId: string, con: any) {
    const supabase = createAdminClient()
    const { data, error } = await supabase
        .from('tool_cons')
        .insert([{ ...con, tool_id: toolId }])
        .select()
        .single()
    if (error) throw new Error(error.message)
    return data
}

export async function updateCon(id: string, fields: any) {
    const supabase = createAdminClient()
    const { error } = await supabase
        .from('tool_cons')
        .update(fields)
        .eq('id', id)
    if (error) throw new Error(error.message)
}

export async function deleteCon(id: string) {
    const supabase = createAdminClient()
    const { error } = await supabase
        .from('tool_cons')
        .delete()
        .eq('id', id)
    if (error) throw new Error(error.message)
}

export async function reorderCons(items: { id: string; sort_order: number }[]) {
    const supabase = createAdminClient()
    await Promise.all(
        items.map((item) =>
            supabase.from('tool_cons').update({ sort_order: item.sort_order }).eq('id', item.id)
        )
    )
}

// ─────────────────────────────────────────────
// REVIEW SECTIONS
// ─────────────────────────────────────────────

export async function ensureToolReview(toolId: string): Promise<string> {
    const supabase = createAdminClient()
    // Check if a review already exists
    const { data: existing } = await supabase
        .from('tool_reviews')
        .select('id')
        .eq('tool_id', toolId)
        .maybeSingle()

    if (existing) return existing.id

    // Create a new review record
    const { data, error } = await supabase
        .from('tool_reviews')
        .insert([{ tool_id: toolId, intro: '' }])
        .select()
        .single()

    if (error) throw new Error(error.message)
    return data.id
}

export async function addReviewSection(reviewId: string, section: any) {
    const supabase = createAdminClient()
    const { data, error } = await supabase
        .from('tool_review_sections')
        .insert([{ ...section, review_id: reviewId }])
        .select()
        .single()
    if (error) throw new Error(error.message)
    return data
}

export async function updateReviewSection(id: string, fields: any) {
    const supabase = createAdminClient()
    const { error } = await supabase
        .from('tool_review_sections')
        .update(fields)
        .eq('id', id)
    if (error) throw new Error(error.message)
}

export async function deleteReviewSection(id: string) {
    const supabase = createAdminClient()
    const { error } = await supabase
        .from('tool_review_sections')
        .delete()
        .eq('id', id)
    if (error) throw new Error(error.message)
}

export async function reorderReviewSections(items: { id: string; sort_order: number }[]) {
    const supabase = createAdminClient()
    await Promise.all(
        items.map((item) =>
            supabase.from('tool_review_sections').update({ sort_order: item.sort_order }).eq('id', item.id)
        )
    )
}
