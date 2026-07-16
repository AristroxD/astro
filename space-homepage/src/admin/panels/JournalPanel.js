import React, { useState, useEffect, useCallback } from 'react';
import { getJournal, upsertJournal, deleteJournal } from '../../lib/db';
import '../AdminDashboard.css';

const EMPTY = { date_str:'', year: new Date().getFullYear().toString(), title:'', excerpt:'', tags:'', read_time:'' };

export default function JournalPanel() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { setEntries(await getJournal()); }
    catch(e) { setMsg({ type:'err', text: e.message }); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew  = () => setEditing({ ...EMPTY });
  const openEdit = (e) => setEditing({ ...e, tags: (e.tags||[]).join(', ') });
  const closeModal = () => { setEditing(null); setMsg(null); };

  const handleSave = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const payload = {
        ...(editing.id ? { id: editing.id } : {}),
        date_str:  editing.date_str,
        year:      editing.year,
        title:     editing.title,
        excerpt:   editing.excerpt,
        tags:      editing.tags.split(',').map(t=>t.trim()).filter(Boolean),
        read_time: editing.read_time,
      };
      await upsertJournal(payload);
      setMsg({ type:'ok', text: editing.id ? 'Entry updated.' : 'Entry created.' });
      await load();
      setTimeout(closeModal, 900);
    } catch(e) {
      setMsg({ type:'err', text: e.message });
    } finally { setSaving(false); }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try { await deleteJournal(id); await load(); }
    catch(e) { setMsg({ type:'err', text: e.message }); }
  };

  return (
    <div>
      <div className="panel-title">JOURNAL</div>

      {msg && !editing && (
        <div className={`status-msg status-msg--${msg.type}`}>{msg.text}</div>
      )}

      <button className="btn-add" onClick={openNew} id="add-journal-btn">+ NEW ENTRY</button>

      {loading ? (
        <div className="admin-loading">LOADING JOURNAL...</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>DATE</th>
              <th>TITLE</th>
              <th>TAGS</th>
              <th>READ TIME</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(entry => (
              <tr key={entry.id}>
                <td className="cell-mono" style={{whiteSpace:'nowrap'}}>
                  <span style={{color:'var(--neon)'}}>{entry.date_str}</span>&nbsp;
                  <span style={{color:'var(--white-30)',fontSize:'0.6rem'}}>{entry.year}</span>
                </td>
                <td className="cell-title">{entry.title}</td>
                <td style={{fontSize:'0.62rem',color:'var(--white-30)'}}>
                  {(entry.tags||[]).join(', ')}
                </td>
                <td style={{fontSize:'0.62rem'}}>{entry.read_time}</td>
                <td>
                  <button className="btn-edit"   onClick={() => openEdit(entry)}>EDIT</button>
                  <button className="btn-delete" onClick={() => handleDelete(entry.id, entry.title)}>DEL</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editing && (
        <div className="admin-modal-overlay" role="dialog" aria-modal="true" aria-label="Journal editor">
          <div className="admin-modal">
            <div className="modal-header">
              {editing.id ? 'EDIT ENTRY' : 'NEW ENTRY'}
              <button className="modal-close" onClick={closeModal} aria-label="Close">✕</button>
            </div>
            <div className="modal-body">
              {msg && <div className={`status-msg status-msg--${msg.type}`}>{msg.text}</div>}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                <Field label="DATE (e.g. MAY 19)" value={editing.date_str} onChange={v=>setEditing(e=>({...e,date_str:v}))} placeholder="MAY 19"/>
                <Field label="YEAR"               value={editing.year}     onChange={v=>setEditing(e=>({...e,year:v}))}     placeholder="2024"/>
              </div>
              <Field label="TITLE *"              value={editing.title}    onChange={v=>setEditing(e=>({...e,title:v}))} />
              <Field label="EXCERPT"              value={editing.excerpt}  onChange={v=>setEditing(e=>({...e,excerpt:v}))} textarea />
              <Field label="TAGS (comma-separated)" value={editing.tags}  onChange={v=>setEditing(e=>({...e,tags:v}))} placeholder="Python, OpenGL" />
              <Field label="READ TIME"            value={editing.read_time} onChange={v=>setEditing(e=>({...e,read_time:v}))} placeholder="6 MIN" />
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeModal}>CANCEL</button>
              <button className="btn-save"   onClick={handleSave} disabled={saving || !editing.title}>
                {saving ? 'SAVING...' : 'SAVE'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, textarea, placeholder }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      {textarea
        ? <textarea className="form-textarea" value={value||''} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={3} />
        : <input    className="form-input"    value={value||''} onChange={e=>onChange(e.target.value)} placeholder={placeholder} />
      }
    </div>
  );
}
