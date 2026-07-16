import React, { useState, useEffect, useCallback } from 'react';
import { getContactLinks, upsertContactLink, deleteContactLink } from '../../lib/db';
import '../AdminDashboard.css';

const EMPTY = { label:'', value:'', href:'', icon:'', order_num: 0 };

export default function ContactPanel() {
  const [links,   setLinks]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { setLinks(await getContactLinks()); }
    catch(e) { setMsg({ type:'err', text: e.message }); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew  = () => setEditing({ ...EMPTY, order_num: links.length + 1 });
  const openEdit = (l) => setEditing({ ...l });
  const closeModal = () => { setEditing(null); setMsg(null); };

  const handleSave = async () => {
    setSaving(true);
    setMsg(null);
    try {
      await upsertContactLink(editing);
      setMsg({ type:'ok', text: 'Link saved.' });
      await load();
      setTimeout(closeModal, 900);
    } catch(e) { setMsg({ type:'err', text: e.message }); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, label) => {
    if (!window.confirm(`Delete "${label}"?`)) return;
    try { await deleteContactLink(id); await load(); }
    catch(e) { setMsg({ type:'err', text: e.message }); }
  };

  return (
    <div>
      <div className="panel-title">CONTACT LINKS</div>
      {msg && !editing && <div className={`status-msg status-msg--${msg.type}`}>{msg.text}</div>}

      <button className="btn-add" onClick={openNew} id="add-contact-btn">+ ADD LINK</button>

      {loading ? (
        <div className="admin-loading">LOADING...</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr><th>ICON</th><th>LABEL</th><th>VALUE</th><th>HREF</th><th>ACTIONS</th></tr>
          </thead>
          <tbody>
            {links.map(l => (
              <tr key={l.id}>
                <td style={{fontSize:'1.1rem'}}>{l.icon}</td>
                <td className="cell-title">{l.label}</td>
                <td style={{color:'var(--white-60)'}}>{l.value}</td>
                <td className="cell-mono" style={{fontSize:'0.62rem',color:'var(--white-30)',maxWidth:160,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                  {l.href}
                </td>
                <td>
                  <button className="btn-edit"   onClick={()=>openEdit(l)}>EDIT</button>
                  <button className="btn-delete" onClick={()=>handleDelete(l.id,l.label)}>DEL</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editing && (
        <div className="admin-modal-overlay" role="dialog" aria-modal="true" aria-label="Contact link editor">
          <div className="admin-modal">
            <div className="modal-header">
              {editing.id ? 'EDIT LINK' : 'NEW LINK'}
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              {msg && <div className={`status-msg status-msg--${msg.type}`}>{msg.text}</div>}
              <div style={{display:'grid',gridTemplateColumns:'1fr 3fr',gap:12}}>
                <Field label="ICON"  value={editing.icon}  onChange={v=>setEditing(e=>({...e,icon:v}))}  placeholder="✉" />
                <Field label="LABEL" value={editing.label} onChange={v=>setEditing(e=>({...e,label:v}))} placeholder="EMAIL" />
              </div>
              <Field label="DISPLAY VALUE" value={editing.value} onChange={v=>setEditing(e=>({...e,value:v}))} placeholder="hello@aristro.dev" />
              <Field label="HREF (URL or mailto:)" value={editing.href} onChange={v=>setEditing(e=>({...e,href:v}))} placeholder="mailto:hello@aristro.dev" />
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeModal}>CANCEL</button>
              <button className="btn-save"   onClick={handleSave} disabled={saving || !editing.label}>
                {saving ? 'SAVING...' : 'SAVE'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input className="form-input" value={value||''} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/>
    </div>
  );
}
