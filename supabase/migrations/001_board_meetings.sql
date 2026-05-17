-- ════════════════════════════════════════════════════════════
-- Migration 001 – Board Meetings, Tasks, Meeting Protocols
-- Run this in: Supabase Dashboard → SQL Editor
-- ════════════════════════════════════════════════════════════

-- ── board_meetings ────────────────────────────────────────────
create table if not exists public.board_meetings (
  id              uuid        primary key default gen_random_uuid(),
  user_id         uuid        not null references public.profiles(id) on delete cascade,
  meeting_number  integer     not null default 1,
  type            text        not null default 'first'
                              check (type in ('first', 'regular')),
  status          text        not null default 'scheduled'
                              check (status in ('scheduled', 'in_progress', 'completed')),
  score_at_meeting integer,
  started_at      timestamptz,
  completed_at    timestamptz,
  created_at      timestamptz not null default now()
);

alter table public.board_meetings enable row level security;

create policy "board_meetings: users see own rows"
  on public.board_meetings for all
  using (auth.uid() = user_id);

-- ── tasks ─────────────────────────────────────────────────────
create table if not exists public.tasks (
  id                   uuid        primary key default gen_random_uuid(),
  user_id              uuid        not null references public.profiles(id) on delete cascade,
  meeting_id           uuid        references public.board_meetings(id) on delete set null,
  title                text        not null,
  description          text,
  axis                 text,
  type                 text        not null default 'manual'
                                   check (type in ('auto', 'manual')),
  status               text        not null default 'open'
                                   check (status in ('open', 'done', 'skipped')),
  action_type          text        check (action_type in ('article', 'vip', 'course', 'none')),
  action_ref           text,
  missed_count         integer     not null default 0,
  completion_confirmed boolean     not null default false,
  completed_at         timestamptz,
  due_date             date,
  created_at           timestamptz not null default now()
);

alter table public.tasks enable row level security;

create policy "tasks: users see own rows"
  on public.tasks for all
  using (auth.uid() = user_id);

-- ── meeting_protocols ─────────────────────────────────────────
create table if not exists public.meeting_protocols (
  id              uuid        primary key default gen_random_uuid(),
  meeting_id      uuid        not null references public.board_meetings(id) on delete cascade,
  user_id         uuid        not null references public.profiles(id) on delete cascade,
  overall_score   integer,
  axes_scores     jsonb,
  tasks_reviewed  jsonb,
  tasks_created   jsonb,
  summary_text    text,
  created_at      timestamptz not null default now()
);

alter table public.meeting_protocols enable row level security;

create policy "meeting_protocols: users see own rows"
  on public.meeting_protocols for all
  using (auth.uid() = user_id);
