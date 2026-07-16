import React, { useState, useEffect } from 'react';
import { getJournal } from '../lib/db';
import './Journal.css';

export default function Journal() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJournal()
      .then(setEntries)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="journal" className="journal-section" aria-labelledby="journal-heading">
      <div className="journal-header">
        <h2 id="journal-heading" className="section-label">JOURNAL</h2>
        <a href="#journal" className="view-all" aria-label="View all journal entries">VIEW ALL →</a>
      </div>

      {loading ? (
        <div style={{fontSize:'0.65rem',letterSpacing:'0.18em',color:'var(--white-30)',padding:'24px 0'}}>
          LOADING JOURNAL...
        </div>
      ) : (
        <div className="journal-log" role="list">
          {entries.map((entry, idx) => (
            <article key={entry.id} className="journal-entry" role="listitem" aria-label={`Journal entry: ${entry.title}`}>
              <div className="entry-datecol" aria-hidden="true">
                <span className="entry-month">{entry.date_str}</span>
                <span className="entry-year">{entry.year}</span>
              </div>
              <div className="entry-connector" aria-hidden="true">
                <div className="entry-dot" />
                {idx < entries.length - 1 && <div className="entry-line" />}
              </div>
              <div className="entry-content">
                <h3 className="entry-title">{entry.title}</h3>
                <p className="entry-excerpt">{entry.excerpt}</p>
                <div className="entry-footer">
                  <div className="entry-tags" aria-label="Tags">
                    {(entry.tags||[]).map(t => (
                      <span key={t} className="tag">{t}</span>
                    ))}
                  </div>
                  <div className="entry-meta">
                    <span className="entry-read">{entry.read_time} READ</span>
                    <a href="#journal" className="entry-link btn-ghost" aria-label={`Read ${entry.title}`}>→</a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
