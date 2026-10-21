-- ─── RESET COMPLETO DE DATOS ──────────────────────────────────────────────────
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- Borra todos los datos de las 9 tablas respetando dependencias (CASCADE)
-- Las tablas quedan vacías pero la estructura se mantiene.

TRUNCATE TABLE
  episode_chat_messages,
  episode_continuity_log,
  storyboard_panels,
  scene_characters,
  scenes,
  acts,
  episodes,
  asset_approvals,
  asset_slots
RESTART IDENTITY CASCADE;

-- Verificar que quedaron vacías
SELECT
  'episodes'               AS tabla, COUNT(*) AS filas FROM episodes UNION ALL
  SELECT 'acts',                                         COUNT(*) FROM acts UNION ALL
  SELECT 'scenes',                                       COUNT(*) FROM scenes UNION ALL
  SELECT 'scene_characters',                             COUNT(*) FROM scene_characters UNION ALL
  SELECT 'storyboard_panels',                            COUNT(*) FROM storyboard_panels UNION ALL
  SELECT 'episode_continuity_log',                       COUNT(*) FROM episode_continuity_log UNION ALL
  SELECT 'episode_chat_messages',                        COUNT(*) FROM episode_chat_messages UNION ALL
  SELECT 'asset_approvals',                              COUNT(*) FROM asset_approvals UNION ALL
  SELECT 'asset_slots',                                  COUNT(*) FROM asset_slots
ORDER BY tabla;
