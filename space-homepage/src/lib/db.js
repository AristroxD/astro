import { supabase } from './supabase';

/* ─── PROJECTS ───────────────────────────────── */
export async function getProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('order_num', { ascending: true });
  if (error) throw error;
  return data;
}

export async function upsertProject(project) {
  const { data, error } = await supabase
    .from('projects')
    .upsert(project, { onConflict: 'id' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteProject(id) {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw error;
}

/* ─── JOURNAL ────────────────────────────────── */
export async function getJournal() {
  const { data, error } = await supabase
    .from('journal')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function upsertJournal(entry) {
  const { data, error } = await supabase
    .from('journal')
    .upsert(entry, { onConflict: 'id' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteJournal(id) {
  const { error } = await supabase.from('journal').delete().eq('id', id);
  if (error) throw error;
}

/* ─── TOOLS ──────────────────────────────────── */
export async function getTools() {
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .order('order_num', { ascending: true });
  if (error) throw error;
  // Shape into the same format as portfolioData
  const system   = data.filter(t => t.category === 'system').map(t => ({ label: t.label, value: t.value, id: t.id }));
  const software = data.filter(t => t.category === 'software').map(t => ({ label: t.label, value: t.value, id: t.id }));
  const hardware = data.filter(t => t.category === 'hardware').map(t => ({ label: t.label, value: t.value, id: t.id }));
  return { system, software, hardware, raw: data };
}

export async function upsertTool(tool) {
  const { data, error } = await supabase
    .from('tools')
    .upsert(tool, { onConflict: 'id' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTool(id) {
  const { error } = await supabase.from('tools').delete().eq('id', id);
  if (error) throw error;
}

/* ─── CONTACT LINKS ──────────────────────────── */
export async function getContactLinks() {
  const { data, error } = await supabase
    .from('contact_links')
    .select('*')
    .order('order_num', { ascending: true });
  if (error) throw error;
  return data;
}

export async function upsertContactLink(link) {
  const { data, error } = await supabase
    .from('contact_links')
    .upsert(link, { onConflict: 'id' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteContactLink(id) {
  const { error } = await supabase.from('contact_links').delete().eq('id', id);
  if (error) throw error;
}

/* ─── ABOUT ──────────────────────────────────── */
export async function getAbout() {
  const { data, error } = await supabase
    .from('about')
    .select('*')
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function upsertAbout(about) {
  const { data, error } = await supabase
    .from('about')
    .upsert(about, { onConflict: 'id' })
    .select()
    .single();
  if (error) throw error;
  return data;
}
