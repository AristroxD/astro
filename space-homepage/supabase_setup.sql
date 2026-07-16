-- ═══════════════════════════════════════════════
-- ARISTRO PORTFOLIO — SUPABASE SETUP SQL
-- Run this in: Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ─── PROJECTS ─────────────────────────────────
create table if not exists projects (
  id          uuid primary key default gen_random_uuid(),
  order_num   int not null default 0,
  title       text not null,
  description text,
  tags        text[] default '{}',
  category    text,
  status      text default 'ACTIVE',
  link        text default '#',
  created_at  timestamptz default now()
);

-- ─── JOURNAL ──────────────────────────────────
create table if not exists journal (
  id          uuid primary key default gen_random_uuid(),
  date_str    text,
  year        text,
  title       text not null,
  excerpt     text,
  tags        text[] default '{}',
  read_time   text,
  created_at  timestamptz default now()
);

-- ─── TOOLS ────────────────────────────────────
create table if not exists tools (
  id          uuid primary key default gen_random_uuid(),
  category    text not null check (category in ('system','software','hardware')),
  label       text not null,
  value       text,
  order_num   int default 0,
  created_at  timestamptz default now()
);

-- ─── CONTACT LINKS ────────────────────────────
create table if not exists contact_links (
  id          uuid primary key default gen_random_uuid(),
  label       text not null,
  value       text,
  href        text,
  icon        text,
  order_num   int default 0,
  created_at  timestamptz default now()
);

-- ─── ABOUT ────────────────────────────────────
create table if not exists about (
  id          uuid primary key default gen_random_uuid(),
  greeting    text default 'Hey, I''m Debajit Dutta.',
  body1       text,
  body2       text,
  focus       text,
  interests   text,
  currently   text,
  created_at  timestamptz default now()
);

-- ─── DISABLE RLS (personal site, anon key used for writes) ───
alter table projects      disable row level security;
alter table journal       disable row level security;
alter table tools         disable row level security;
alter table contact_links disable row level security;
alter table about         disable row level security;

-- ─── SEED: PROJECTS ───────────────────────────
insert into projects (order_num, title, description, tags, category, status, link) values
(1, 'Terrain Generator', 'Procedural terrain generation using Perlin noise and WebGL.', array['Python','NumPy'], 'Systems', 'ACTIVE', '#'),
(2, 'Discord Bot', 'A multipurpose bot to help our college study server stay organized.', array['Python','Discord.py'], 'Automation', 'LIVE', '#'),
(3, 'C Data Structures', 'A hand-rolled library of core data structures written in pure C.', array['C','Data Structures'], 'Library', 'ARCHIVED', '#'),
(4, '3D Asset Library', 'Collection of modular 3D assets created for game prototyping.', array['Blender','Modeling'], 'Creative', 'WIP', '#'),
(5, 'Study Tracker', 'CLI tool to log and visualize daily study sessions and goals.', array['Python','SQLite'], 'Productivity', 'ACTIVE', '#'),
(6, 'Automation Scripts', 'Collection of shell and Python scripts for daily workflow automation.', array['Python','Productivity'], 'Tools', 'ONGOING', '#');

-- ─── SEED: JOURNAL ────────────────────────────
insert into journal (date_str, year, title, excerpt, tags, read_time, created_at) values
('MAY 19', '2024', 'Understanding Pointers in C', 'A study note on pointers, memory, and how things really work under the hood.', array['C','Beta Structures'], '6 MIN', now() - interval '1 day'),
('MAY 14', '2024', 'My Journey with OpenGL', 'Documenting my first 3D terrain and what I learned about graphics programming.', array['OpenGL','Graphics'], '9 MIN', now() - interval '6 days'),
('MAY 09', '2024', 'Building a Discord Study Bot', 'How I built a multipurpose bot to help our college study server.', array['Python','Discord'], '7 MIN', now() - interval '11 days'),
('MAY 03', '2024', 'Semester Learnings', 'Key concepts, mistakes, and takeaways from this semester''s grind.', array['Meta','Reflection'], '5 MIN', now() - interval '17 days');

-- ─── SEED: TOOLS ──────────────────────────────
insert into tools (category, label, value, order_num) values
('system', 'OS',     'Windows 11',      1),
('system', 'CPU',    'Intel i5-12400F', 2),
('system', 'GPU',    'RTX 3060',        3),
('system', 'RAM',    '16GB DDR4',       4),
('system', 'EDITOR', 'VS Code',         5),
('system', 'SHELL',  'PowerShell',      6),
('software', 'VS Code', 'VS Code', 1),
('software', 'Blender', 'Blender', 2),
('software', 'Figma',   'Figma',   3),
('software', 'DaVinci', 'DaVinci', 4),
('software', 'Photoshop','Photoshop',5),
('hardware', 'Custom PC',    'Custom PC',    1),
('hardware', 'Mechanical KB','Mechanical KB',2),
('hardware', '1080p Monitor','1080p Monitor',3),
('hardware', 'Headphones',   'Headphones',   4),
('hardware', 'Gamepad',      'Gamepad',      5);

-- ─── SEED: CONTACT LINKS ──────────────────────
insert into contact_links (label, value, href, icon, order_num) values
('EMAIL',     'hello@aristro.dev',        'mailto:hello@aristro.dev',    '✉', 1),
('GITHUB',    'github.com/AristroxD',     'https://github.com/AristroxD','⌥', 2),
('LINKEDIN',  'linkedin.com/in/aristro',  '#',                            '◈', 3),
('INSTAGRAM', '@aristro.exe',             '#',                            '◉', 4);

-- ─── SEED: ABOUT ──────────────────────────────
insert into about (greeting, body1, body2, focus, interests, currently) values
(
  'Hey, I''m Debajit Dutta.',
  'I''m a BSc Computer Science student who loves building things, breaking them, and figuring out how they work.',
  'This is my space for projects, notes, experiments, and everything I learn along the way.',
  'Systems Programming, Graphics, AI/ML',
  'Space, Sci-Fi, Music, Productivity',
  'Learning Computer Graphics & Game Dev'
);

-- Done! All tables created and seeded.
