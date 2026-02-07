-- Create newsletter_subscribers table
create table public.newsletter_subscribers (
  id uuid not null default gen_random_uuid (),
  email text not null,
  source text null,
  meta jsonb null,
  created_at timestamp with time zone not null default now(),
  constraint newsletter_subscribers_pkey primary key (id),
  constraint newsletter_subscribers_email_key unique (email)
);

-- Enable RLS
alter table public.newsletter_subscribers enable row level security;

-- Allow inserts from anon (public) logic for now, or service role. 
-- Since we use API route with Service Role (usually), RLS might block if not configured.
-- But standard practice is to allow service role to bypass RLS. 
-- For anon inserts (if using client), we need policy. 
-- Since we use server route, we are fine *if* we use Service Role Key.
-- But user might be using Anon key in route. 
-- Let's add a policy to allow anon inserts just in case.

create policy "Enable insert for everyone" on "public"."newsletter_subscribers"
as permissive for insert
to public
with check (true);
