import React, { useState, useEffect } from 'react';
import { getAbout } from '../lib/db';
import './About.css';

const ASCII_FACE = `/\\  /\\\n(  \\/  )\n \\(oo)/\n / || \\\n(_||_)`;

const DEFAULTS = {
  greeting:  "Hey, I'm Debajit Dutta.",
  body1:     "I'm a BSc Computer Science student who loves building things, breaking them, and figuring out how they work.",
  body2:     "This is my space for projects, notes, experiments, and everything I learn along the way.",
  focus:     "Systems Programming, Graphics, AI/ML",
  interests: "Space, Sci-Fi, Music, Productivity",
  currently: "Learning Computer Graphics & Game Dev",
};

export default function About() {
  const [about, setAbout] = useState(DEFAULTS);

  useEffect(() => {
    getAbout()
      .then(data => { if (data) setAbout(data); })
      .catch(console.error);
  }, []);

  return (
    <section id="about" className="about-section" aria-labelledby="about-heading">
      <h2 id="about-heading" className="section-label">ABOUT</h2>

      <div className="about-grid">
        <div className="about-ascii card" aria-hidden="true">
          <div className="ascii-header">WHOAMI.EXE</div>
          <pre className="ascii-art">{ASCII_FACE}</pre>
        </div>

        <div className="about-intro">
          <h3 className="about-greeting">{about.greeting}</h3>
          <p className="about-body">{about.body1}</p>
          <p className="about-body">{about.body2}</p>
          <a href="#contact" className="btn-ghost about-more-link" aria-label="Navigate to contact">
            &gt; More about me →
          </a>
        </div>

        <div className="about-stats">
          <div className="about-stat-col">
            <div className="stat-label">FOCUS</div>
            <div className="stat-value">{about.focus}</div>
          </div>
          <div className="about-stat-col">
            <div className="stat-label">INTERESTS</div>
            <div className="stat-value">{about.interests}</div>
          </div>
          <div className="about-stat-col">
            <div className="stat-label">CURRENTLY</div>
            <div className="stat-value">{about.currently}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
