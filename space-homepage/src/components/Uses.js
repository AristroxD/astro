import React, { useState, useEffect } from 'react';
import './Uses.css';
import { getTools } from '../lib/db';

const DEFAULT_TOOLS = {
  system:   [{ label:'OS', value:'Windows 11' },{ label:'CPU', value:'Intel i5-12400F' },{ label:'GPU', value:'RTX 3060' },{ label:'RAM', value:'16GB DDR4' },{ label:'EDITOR', value:'VS Code' },{ label:'SHELL', value:'PowerShell' }],
  software: [{ label:'VS Code' },{ label:'Blender' },{ label:'Figma' },{ label:'DaVinci' },{ label:'Photoshop' }],
  hardware: [{ label:'Custom PC' },{ label:'Mechanical KB' },{ label:'1080p Monitor' },{ label:'Headphones' },{ label:'Gamepad' }],
};

export default function Uses() {
  const [tools, setTools] = useState(DEFAULT_TOOLS);

  useEffect(() => {
    getTools()
      .then(t => { if (t.raw?.length) setTools(t); })
      .catch(console.error);
  }, []);

  return (
    <section id="uses" className="uses-section" aria-labelledby="uses-heading">
      <h2 id="uses-heading" className="section-label">USES</h2>

      <div className="uses-grid">
        <div className="uses-specs card" aria-label="System specifications">
          <div className="uses-specs-header">MY SETUP</div>
          <div className="specs-list">
            {tools.system.map(({ label, value }) => (
              <div key={label} className="spec-row">
                <span className="spec-label">{label}</span>
                <span className="spec-value">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="uses-desk card" aria-label="Desk setup visual">
          <div className="desk-inner"><DeskVisual /></div>
          <div className="desk-caption">MY DESK // GROUND CONTROL</div>
        </div>

        <div className="uses-terminal card" aria-label="Terminal status">
          <div className="terminal-titlebar" aria-hidden="true">
            <span className="term-btn term-btn-red" />
            <span className="term-btn term-btn-yellow" />
            <span className="term-btn term-btn-green" />
            <span className="term-title">aristro@system: ~</span>
          </div>
          <TerminalContent />
        </div>

        <div className="uses-software card" aria-label="Software tools">
          <div className="uses-sub-header">SOFTWARE</div>
          <div className="sw-icons">
            {tools.software.map(s => (
              <div key={s.label} className="sw-chip" title={s.label}>{(s.label||'').slice(0,2).toUpperCase()}</div>
            ))}
          </div>
        </div>

        <div className="uses-hardware card" aria-label="Hardware tools">
          <div className="uses-sub-header">HARDWARE</div>
          <div className="hw-list">
            {tools.hardware.map(h => (
              <div key={h.label} className="hw-item">
                <span className="hw-dot" aria-hidden="true">▸</span>
                {h.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TerminalContent() {
  return (
    <div className="term-body" aria-live="polite">
      <div className="term-line">
        <span className="term-prompt">aristro@system:~$</span>&nbsp;
        <span className="term-cmd">whoami</span>
      </div>
      <div className="term-line term-output">Debajit Dutta (Aristro)</div>
      <div className="term-line">
        <span className="term-prompt">aristro@system:~$</span>&nbsp;
        <span className="term-cmd">status</span>
      </div>
      <div className="term-table">
        {[
          ['Student',         'BSc Computer Science'],
          ['Location',        'Earth'],
          ['Current Mission', 'Learn. Build. Share.'],
          ['System Status',   'Online'],
          ['Energy',          '100% ⚡'],
        ].map(([k, v]) => (
          <div key={k} className="term-table-row">
            <span className="term-key">{k}</span>
            <span className="term-val">{v}</span>
          </div>
        ))}
      </div>
      <div className="term-line">
        <span className="term-prompt">aristro@system:~$</span>&nbsp;
        <span className="term-cmd">_</span>
        <span className="term-cursor" aria-hidden="true">█</span>
      </div>
    </div>
  );
}


function DeskVisual() {
  return (
    <div className="desk-visual" aria-hidden="true">
      <div className="dv-monitor">
        <div className="dv-screen">
          <div className="dv-code-line" style={{width:'80%'}} />
          <div className="dv-code-line" style={{width:'60%'}} />
          <div className="dv-code-line neon" style={{width:'70%'}} />
          <div className="dv-code-line" style={{width:'45%'}} />
          <div className="dv-code-line" style={{width:'65%'}} />
        </div>
        <div className="dv-stand" />
        <div className="dv-base" />
      </div>
      <div className="dv-kb">
        {Array.from({length:12}).map((_,i) => (
          <div key={i} className="dv-key" />
        ))}
      </div>
      <div className="dv-mouse" />
    </div>
  );
}
