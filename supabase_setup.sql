-- ==========================================================
-- SUPABASE SECURITY & ANALYTICS SETUP
-- ==========================================================

-- 1. Enable RLS on all tables
ALTER TABLE public.ai_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- 2. Create Analytics Table for "Live Traffic"
CREATE TABLE IF NOT EXISTS public.page_views (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  path text NOT NULL,
  user_agent text,
  referrer text,
  ip_hash text -- Storing hash for privacy while allowing unique counts
);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- 3. Define RLS Policies

-- Policies for ai_tools
DROP POLICY IF EXISTS "Public Read ai_tools" ON public.ai_tools;
CREATE POLICY "Public Read ai_tools" ON public.ai_tools FOR SELECT USING (published = true);

DROP POLICY IF EXISTS "Admin All ai_tools" ON public.ai_tools;
CREATE POLICY "Admin All ai_tools" ON public.ai_tools FOR ALL USING (auth.role() = 'authenticated');

-- Policies for blog_posts
DROP POLICY IF EXISTS "Public Read blog_posts" ON public.blog_posts;
CREATE POLICY "Public Read blog_posts" ON public.blog_posts FOR SELECT USING (published = true);

DROP POLICY IF EXISTS "Admin All blog_posts" ON public.blog_posts;
CREATE POLICY "Admin All blog_posts" ON public.blog_posts FOR ALL USING (auth.role() = 'authenticated');

-- Policies for tags
DROP POLICY IF EXISTS "Public Read tags" ON public.tags;
CREATE POLICY "Public Read tags" ON public.tags FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin All tags" ON public.tags;
CREATE POLICY "Admin All tags" ON public.tags FOR ALL USING (auth.role() = 'authenticated');

-- Policies for categories
DROP POLICY IF EXISTS "Public Read categories" ON public.categories;
CREATE POLICY "Public Read categories" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin All categories" ON public.categories;
CREATE POLICY "Admin All categories" ON public.categories FOR ALL USING (auth.role() = 'authenticated');

-- Policies for affiliate_links
DROP POLICY IF EXISTS "Public Read affiliate_links" ON public.affiliate_links;
CREATE POLICY "Public Read affiliate_links" ON public.affiliate_links FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin All affiliate_links" ON public.affiliate_links;
CREATE POLICY "Admin All affiliate_links" ON public.affiliate_links FOR ALL USING (auth.role() = 'authenticated');

-- Policies for affiliate_clicks
DROP POLICY IF EXISTS "Public Insert affiliate_clicks" ON public.affiliate_clicks;
CREATE POLICY "Public Insert affiliate_clicks" ON public.affiliate_clicks FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin All affiliate_clicks" ON public.affiliate_clicks;
CREATE POLICY "Admin All affiliate_clicks" ON public.affiliate_clicks FOR ALL USING (auth.role() = 'authenticated');

-- Policies for tool_comments
DROP POLICY IF EXISTS "Public Select approved tool_comments" ON public.tool_comments;
CREATE POLICY "Public Select approved tool_comments" ON public.tool_comments FOR SELECT USING (approved = true);

DROP POLICY IF EXISTS "Public Insert tool_comments" ON public.tool_comments;
CREATE POLICY "Public Insert tool_comments" ON public.tool_comments FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin All tool_comments" ON public.tool_comments;
CREATE POLICY "Admin All tool_comments" ON public.tool_comments FOR ALL USING (auth.role() = 'authenticated');

-- Policies for blog_comments
DROP POLICY IF EXISTS "Public Select approved blog_comments" ON public.blog_comments;
CREATE POLICY "Public Select approved blog_comments" ON public.blog_comments FOR SELECT USING (approved = true);

DROP POLICY IF EXISTS "Public Insert blog_comments" ON public.blog_comments;
CREATE POLICY "Public Insert blog_comments" ON public.blog_comments FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin All blog_comments" ON public.blog_comments;
CREATE POLICY "Admin All blog_comments" ON public.blog_comments FOR ALL USING (auth.role() = 'authenticated');

-- Policies for page_views
DROP POLICY IF EXISTS "Public Insert page_views" ON public.page_views;
CREATE POLICY "Public Insert page_views" ON public.page_views FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin Select page_views" ON public.page_views;
CREATE POLICY "Admin Select page_views" ON public.page_views FOR SELECT USING (auth.role() = 'authenticated');
