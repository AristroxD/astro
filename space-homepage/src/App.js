import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import StarCanvas       from './components/StarCanvas';
import Navbar           from './components/Navbar';
import Hero             from './components/Hero';
import Projects         from './components/Projects';
import Journal          from './components/Journal';
import About            from './components/About';
import Uses             from './components/Uses';
import Contact          from './components/Contact';
import Footer           from './components/Footer';
import AdminLogin       from './admin/AdminLogin';
import AdminDashboard   from './admin/AdminDashboard';

function Portfolio() {
  return (
    <>
      <canvas id="star-canvas" aria-hidden="true" />
      <div className="bg-texture" aria-hidden="true" />
      <StarCanvas />
      <div className="app-shell">
        <Navbar />
        <main id="main-content">
          <Hero />
          <Projects />
          <Journal />
          <About />
          <Uses />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}

function AdminRoute() {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem('aristro_admin') === '1'
  );

  const handleLogin  = () => setAuthed(true);
  const handleLogout = () => {
    sessionStorage.removeItem('aristro_admin');
    setAuthed(false);
  };

  if (!authed) return <AdminLogin onLogin={handleLogin} />;
  return <AdminDashboard onLogout={handleLogout} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"      element={<Portfolio />} />
        <Route path="/admin" element={<AdminRoute />} />
        <Route path="/admin/*" element={<AdminRoute />} />
      </Routes>
    </BrowserRouter>
  );
}