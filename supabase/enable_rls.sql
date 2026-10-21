-- ─── ENABLE ROW LEVEL SECURITY ────────────────────────────────────────────────
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)
--
-- Strategy: Enable RLS on all public tables.
-- All app data access goes through API routes using the service role key,
-- which bypasses RLS entirely — so no policies are needed.
-- The anon key (browser) will be fully locked out, which is correct.

ALTER TABLE public.episodes               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.acts                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenes                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scene_characters       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.storyboard_panels      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.episode_continuity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.episode_chat_messages    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_approvals          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_slots              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.episode_asset_requests   ENABLE ROW LEVEL SECURITY;

-- Verify: should show rls_enabled = true for all tables
SELECT tablename, rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'episodes', 'acts', 'scenes', 'scene_characters',
    'storyboard_panels', 'episode_continuity_log',
    'episode_chat_messages', 'asset_approvals', 'asset_slots',
    'episode_asset_requests'
  )
ORDER BY tablename;
