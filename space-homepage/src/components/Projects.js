import React, { useState, useEffect } from 'react';
import { getProjects } from '../lib/db';
import './Projects.css';

const STATUS_CLASS = {
  ACTIVE:   'badge-active',
  LIVE:     'badge-live',
  WIP:      'badge-wip',
  ARCHIVED: 'badge-archived',
  ONGOING:  'badge-ongoing',
};

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="projects" className="projects-section" aria-labelledby="projects-heading">
      <div className="projects-header">
        <h2 id="projects-heading" className="section-label">PROJECTS</h2>
        <a href="#projects" className="view-all" aria-label="View all projects">VIEW ALL →</a>
      </div>

      {loading ? (
        <div className="projects-loading" aria-live="polite">LOADING PROJECTS...</div>
      ) : (
        <div className="projects-bento" role="list">
          {projects.map((p) => (
            <article key={p.id} className="project-card card" role="listitem">
              <div className="project-card-top">
                <span className="project-id">{String(p.order_num).padStart(2,'0')}</span>
                <span className={`badge ${STATUS_CLASS[p.status] || 'badge-archived'}`}>{p.status}</span>
              </div>
              <h3 className="project-title">{p.title}</h3>
              <p className="project-desc">{p.description}</p>
              <div className="project-card-footer">
                <div className="project-tags" aria-label="Tags">
                  {(p.tags||[]).map(t => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
                <a href={p.link || '#'} className="btn-ghost project-link" aria-label={`Open ${p.title}`}>
                  → OPEN
                </a>
              </div>
              <div className="project-category">{p.category}</div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
