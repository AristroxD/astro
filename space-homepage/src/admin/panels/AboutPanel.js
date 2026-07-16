import React, { useState, useEffect, useCallback } from 'react';
import { getAbout, upsertAbout, getTools, upsertTool, deleteTool } from '../../lib/db';
import '../AdminDashboard.css';

const CAT_OPTS = ['system','software','hardware'];

export default function AboutPanel() {
  const [about,    setAbout]   = useState(null);
  const [tools,    setTools]   = useState({ system:[], software:[], hardware:[], raw:[] });
  const [loading,  setLoading] = useState(true);
  const [savingA,  setSavingA] = useState(false);
  const [editTool, setEditTool]= useState(null);
  const [savingT,  setSavingT] = useState(false);
  const [msg,      setMsg]     = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [a, t] = await Promise.all([getAbout(), getTools()]);
      setAbout(a || { greeting:'', body1:'', body2:'', focus:'', interests:'', currently:'' });
      setTools(t);
    } catch(e) { setMsg({ type:'err', text: e.message }); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const saveAbout = async () => {
    setSavingA(true);
    setMsg(null);
    try {
      await upsertAbout(about);
      setMsg({ type:'ok', text: 'About saved.' });
    } catch(e) { setMsg({ type:'err', text: e.message }); }
    finally { setSavingA(false); }
  };

  const openNewTool  = () => setEditTool({ category:'system', label:'', value:'', order_num: tools.raw.length+1 });
  const openEditTool = (t) => setEditTool({ ...t });
  const closeTool    = () => { setEditTool(null); };

  const saveTool = async () => {
    setSavingT(true);
    try {
      await upsertTool(editTool);
      await load();
      closeTool();
    } catch(e) { setMsg({ type:'err', text: e.message }); }
    finally { setSavingT(false); }
  };

  const handleDeleteTool = async (id, label) => {
    if (!window.confirm(`Delete tool "${label}"?`)) return;
    try { await deleteTool(id); await load(); }
    catch(e) { setMsg({ type:'err', text: e.message }); }
  };

  if (loading) return <div className="admin-loading">LOADING...</div>;

  return (
    <div style={{display:'flex', flexDirection:'column', gap:32}}>
      <div className="panel-title">ABOUT / USES</div>
      {msg && <div className={`status-msg status-msg--${msg.type}`}>{msg.text}</div>}

      {/* About section */}
      <div>
        <div className="section-label">BIO</div>
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <Field label="GREETING" value={about?.greeting} onChange={v=>setAbout(a=>({...a,greeting:v}))} />
          <Field label="PARAGRAPH 1" value={about?.body1} onChange={v=>setAbout(a=>({...a,body1:v}))} textarea />
          <Field label="PARAGRAPH 2" value={about?.body2} onChange={v=>setAbout(a=>({...a,body2:v}))} textarea />
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12}}>
            <Field label="FOCUS"      value={about?.focus}      onChange={v=>setAbout(a=>({...a,focus:v}))} />
            <Field label="INTERESTS"  value={about?.interests}  onChange={v=>setAbout(a=>({...a,interests:v}))} />
            <Field label="CURRENTLY"  value={about?.currently}  onChange={v=>setAbout(a=>({...a,currently:v}))} />
          </div>
          <div>
            <button className="btn-save" onClick={saveAbout} disabled={savingA}>
              {savingA ? 'SAVING...' : 'SAVE BIO'}
            </button>
          </div>
        </div>
      </div>

      {/* Tools section */}
      <div>
        <div className="section-label" style={{marginBottom:12}}>TOOLS &amp; SETUP</div>
        <button className="btn-add" onClick={openNewTool} id="add-tool-btn">+ ADD TOOL</button>
        <table className="admin-table">
          <thead>
            <tr><th>CATEGORY</th><th>LABEL</th><th>VALUE</th><th>ACTIONS</th></tr>
          </thead>
          <tbody>
            {tools.raw.map(t => (
              <tr key={t.id}>
                <td><span className="badge badge-active" style={{fontSize:'0.55rem'}}>{t.category}</span></td>
                <td className="cell-title">{t.label}</td>
                <td style={{color:'var(--white-60)'}}>{t.value}</td>
                <td>
                  <button className="btn-edit"   onClick={()=>openEditTool(t)}>EDIT</button>
                  <button className="btn-delete" onClick={()=>handleDeleteTool(t.id,t.label)}>DEL</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tool modal */}
      {editTool && (
        <div className="admin-modal-overlay" role="dialog" aria-modal="true" aria-label="Tool editor">
          <div className="admin-modal">
            <div className="modal-header">
              {editTool.id ? 'EDIT TOOL' : 'NEW TOOL'}
              <button className="modal-close" onClick={closeTool}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">CATEGORY</label>
                <select className="form-select" value={editTool.category} onChange={e=>setEditTool(t=>({...t,category:e.target.value}))}>
                  {CAT_OPTS.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <Field label="LABEL" value={editTool.label} onChange={v=>setEditTool(t=>({...t,label:v}))} placeholder="OS, CPU, VS Code..." />
              <Field label="VALUE" value={editTool.value} onChange={v=>setEditTool(t=>({...t,value:v}))} placeholder="Windows 11, Intel i5..." />
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeTool}>CANCEL</button>
              <button className="btn-save"   onClick={saveTool} disabled={savingT || !editTool.label}>
                {savingT ? 'SAVING...' : 'SAVE'}
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
        ? <textarea className="form-textarea" value={value||''} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={3}/>
        : <input    className="form-input"    value={value||''} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/>
      }
    </div>
  );
}
