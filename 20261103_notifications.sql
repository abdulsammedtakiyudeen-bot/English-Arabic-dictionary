-- User-scoped in-app notifications. Apply in the Supabase SQL editor.
create table if not exists public.user_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 140),
  message text not null check (char_length(message) between 1 and 2000),
  category text not null default 'general' check (category in ('learning','vocabulary','lesson','exam','premium','account','security','announcement','general')),
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists user_notifications_user_created_idx on public.user_notifications(user_id, created_at desc);
alter table public.user_notifications enable row level security;
drop policy if exists "Users read own notifications" on public.user_notifications;
create policy "Users read own notifications" on public.user_notifications for select to authenticated using (auth.uid() = user_id);
drop policy if exists "Users update own notification read state" on public.user_notifications;
create policy "Users update own notification read state" on public.user_notifications for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
-- Inserts should be performed by trusted server-side functions/admin workflows, not public clients.
