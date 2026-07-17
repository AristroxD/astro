import React, { useState, useEffect, useCallback } from 'react';
import { getProjects, upsertProject, deleteProject } from '../../lib/db';
import '../AdminDashboard.css';

const STATUS_OPTS = ['ACTIVE','LIVE','WIP','ARCHIVED','ONGOING'];
const EMPTY = { title:'', description:'', tags:'', category:'', status:'ACTIVE', link:'#', image_url:'' };

export default function ProjectsPanel() {
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [editing,  setEditing]  = useState(null); // null | {} | project
  const [saving,   setSaving]   = useState(false);
  const [msg,      setMsg]      = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setProjects(await getProjects());
    } catch(e) {
      setMsg({ type:'err', text: e.message });
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew  = () => setEditing({ ...EMPTY });
  const openEdit = (p) => setEditing({ ...p, tags: (p.tags||[]).join(', '), image_url: p.image_url || '' });
  const closeModal = () => { setEditing(null); setMsg(null); };

  const handleSave = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const payload = {
        ...(editing.id ? { id: editing.id } : {}),
        title:       editing.title,
        description: editing.description,
        tags:        editing.tags.split(',').map(t=>t.trim()).filter(Boolean),
        category:    editing.category,
        status:      editing.status,
        link:        editing.link || '#',
        order_num:   editing.order_num || projects.length + 1,
        image_url:   editing.image_url || '',
      };
      await upsertProject(payload);
      setMsg({ type:'ok', text: editing.id ? 'Project updated.' : 'Project created.' });
      await load();
      setTimeout(closeModal, 900);
    } catch(e) {
      setMsg({ type:'err', text: e.message });
    } finally { setSaving(false); }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await deleteProject(id);
      await load();
    } catch(e) { setMsg({ type:'err', text: e.message }); }
  };

  return (
    <div>
      <div className="panel-title">PROJECTS</div>

      {msg && !editing && (
        <div className={`status-msg status-msg--${msg.type}`}>{msg.text}</div>
      )}

      <button className="btn-add" onClick={openNew} id="add-project-btn">
        + NEW PROJECT
      </button>

      {loading ? (
        <div className="admin-loading">LOADING PROJECTS...</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>TITLE</th>
              <th>CATEGORY</th>
              <th>STATUS</th>
              <th>TAGS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p, i) => (
              <tr key={p.id}>
                <td className="cell-mono">{String(i+1).padStart(2,'0')}</td>
                <td className="cell-title">{p.title}</td>
                <td>{p.category}</td>
                <td>
                  <span className={`badge badge-${(p.status||'').toLowerCase()}`}>{p.status}</span>
                </td>
                <td className="cell-mono" style={{fontSize:'0.62rem', color:'var(--white-30)'}}>
                  {(p.tags||[]).join(', ')}
                </td>
                <td>
                  <button className="btn-edit"   onClick={() => openEdit(p)}>EDIT</button>
                  <button className="btn-delete" onClick={() => handleDelete(p.id, p.title)}>DEL</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {editing && (
        <div className="admin-modal-overlay" role="dialog" aria-modal="true" aria-label="Project editor">
          <div className="admin-modal">
            <div className="modal-header">
              {editing.id ? 'EDIT PROJECT' : 'NEW PROJECT'}
              <button className="modal-close" onClick={closeModal} aria-label="Close">✕</button>
            </div>
            <div className="modal-body">
              {msg && <div className={`status-msg status-msg--${msg.type}`}>{msg.text}</div>}
              <Field label="TITLE *"       value={editing.title}       onChange={v => setEditing(e=>({...e,title:v}))} />
              <Field label="DESCRIPTION"   value={editing.description} onChange={v => setEditing(e=>({...e,description:v}))} textarea />
              <Field label="TAGS (comma-separated)" value={editing.tags} onChange={v => setEditing(e=>({...e,tags:v}))} placeholder="Python, NumPy" />
              <Field label="CATEGORY"      value={editing.category}    onChange={v => setEditing(e=>({...e,category:v}))} placeholder="Systems" />
              <div className="form-group">
                <label className="form-label">STATUS</label>
                <select className="form-select" value={editing.status} onChange={e2 => setEditing(e=>({...e,status:e2.target.value}))}>
                  {STATUS_OPTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <Field label="LINK"          value={editing.link}        onChange={v => setEditing(e=>({...e,link:v}))} placeholder="https://github.com/..." />
              <Field label="IMAGE URL"     value={editing.image_url}   onChange={v => setEditing(e=>({...e,image_url:v}))} placeholder="/assets/earth.png or https://..." />
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
