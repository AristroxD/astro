import React, { useState } from 'react';
import './AdminLogin.css';

export default function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [attempt, setAttempt]   = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    // Simulate a slight delay for effect
    await new Promise(r => setTimeout(r, 600));
    if (password === process.env.REACT_APP_ADMIN_PASSWORD) {
      sessionStorage.setItem('aristro_admin', '1');
      onLogin();
    } else {
      setAttempt(a => a + 1);
      setError(`ACCESS DENIED — INVALID CREDENTIALS (attempt ${attempt + 1})`);
      setPassword('');
    }
    setLoading(false);
  };

  return (
    <div className="login-shell">
      {/* scanlines */}
      <div className="login-scanlines" aria-hidden="true" />

      <div className="login-box" role="main">
        <div className="login-header">
          <div className="login-logo">ARISTRO</div>
          <div className="login-subtitle">COMMAND CENTER — RESTRICTED ACCESS</div>
        </div>

        <div className="login-boot" aria-hidden="true">
          <div className="lb-line">&gt; AUTHENTICATING OPERATOR...</div>
          <div className="lb-line">&gt; CLEARANCE LEVEL: ALPHA</div>
          <div className="lb-line lb-neon">&gt; ENTER CREDENTIALS TO PROCEED</div>
        </div>

        <form className="login-form" onSubmit={handleSubmit} aria-label="Admin login">
          <div className="login-field">
            <label className="login-label" htmlFor="admin-password">
              PASSWD://
            </label>
            <input
              id="admin-password"
              type="password"
              className={`login-input ${error ? 'login-input--error' : ''}`}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="enter passphrase"
              autoComplete="current-password"
              autoFocus
              disabled={loading}
            />
          </div>

          {error && (
            <div className="login-error" role="alert" aria-live="assertive">
              <span className="error-icon" aria-hidden="true">✖</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-btn"
            id="admin-login-submit"
            disabled={loading || !password}
          >
            {loading
              ? '> AUTHENTICATING...'
              : '> AUTHENTICATE →'}
          </button>
        </form>

        <div className="login-footer" aria-hidden="true">
          ARISTRO COMMAND SYSTEM v1.0 — UNAUTHORIZED ACCESS PROHIBITED
        </div>
      </div>
    </div>
  );
}
