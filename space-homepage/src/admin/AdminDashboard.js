import React, { useState } from 'react';
import './AdminDashboard.css';
import ProjectsPanel from './panels/ProjectsPanel';
import JournalPanel  from './panels/JournalPanel';
import AboutPanel    from './panels/AboutPanel';
import ContactPanel  from './panels/ContactPanel';

const TABS = [
  { id: 'projects', label: 'PROJECTS',  icon: '◧' },
  { id: 'journal',  label: 'JOURNAL',   icon: '◨' },
  { id: 'about',    label: 'ABOUT / USES', icon: '◩' },
  { id: 'contact',  label: 'CONTACT',   icon: '◪' },
];

export default function AdminDashboard({ onLogout }) {
  const [tab, setTab] = useState('projects');

  return (
    <div className="admin-shell">
      {/* Sidebar */}
      <aside className="admin-sidebar" aria-label="Admin navigation">
        <div className="sidebar-top">
          <div className="sidebar-logo">ARISTRO</div>
          <div className="sidebar-sub">COMMAND CENTER</div>
          <div className="sidebar-status">
            <span className="status-dot" aria-hidden="true" />
            ADMIN MODE
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Section navigation">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`sidebar-tab ${tab === t.id ? 'sidebar-tab--active' : ''}`}
              onClick={() => setTab(t.id)}
              aria-current={tab === t.id ? 'page' : undefined}
              id={`admin-tab-${t.id}`}
            >
              <span className="tab-icon" aria-hidden="true">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <a
            href="/"
            className="sidebar-link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View live site in new tab"
          >
            ↗ VIEW LIVE SITE
          </a>
          <button
            className="sidebar-logout"
            onClick={onLogout}
            id="admin-logout-btn"
            aria-label="Log out of admin panel"
          >
            ✕ LOGOUT
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-main" id="admin-main-content">
        <div className="admin-topbar">
          <div className="topbar-path">
            <span className="topbar-root">ARISTRO://</span>
            <span className="topbar-section">ADMIN</span>
            <span className="topbar-sep">/</span>
            <span className="topbar-current">{tab.toUpperCase()}</span>
          </div>
          <div className="topbar-info" aria-hidden="true">
            <span className="topbar-dot" />
            DATABASE: SUPABASE — CONNECTED
          </div>
        </div>

        <div className="admin-panel-wrap">
          {tab === 'projects' && <ProjectsPanel />}
          {tab === 'journal'  && <JournalPanel />}
          {tab === 'about'    && <AboutPanel />}
          {tab === 'contact'  && <ContactPanel />}
        </div>
      </main>
    </div>
  );
}
