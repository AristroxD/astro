import React, { useState, useRef, useEffect } from 'react';
import './Uses.css';

export default function TerminalChat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '> INITIALIZING SYSTEM CORE...\n> ASK ARISTRO ONLINE. HOW CAN I ASSIST, EXPLORER?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Local development will proxy this to setupProxy.js, Production will hit Vercel Serverless Function
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, userMsg].filter(m => m.role !== 'system').slice(-6) 
        })
      });

      if (!response.ok) throw new Error('API Request Failed');

      const data = await response.json();
      const botMsg = data.choices[0].message;
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: '> ERROR: CONNECTION TO AI CORE FAILED.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="term-body" style={{ flex: 1, overflowY: 'auto' }} ref={scrollRef}>
      {messages.map((m, i) => (
        <div key={i} className="term-line" style={{ marginBottom: '12px' }}>
          {m.role === 'user' ? (
            <><span className="term-prompt">guest@system:~$</span> <span className="term-cmd">{m.content}</span></>
          ) : (
            <div className="term-output" style={{ whiteSpace: 'pre-wrap', color: 'var(--neon)' }}>{m.content}</div>
          )}
        </div>
      ))}
      
      {loading && (
        <div className="term-line term-output" style={{ color: 'var(--white-30)' }}>
          &gt; SYSTEM CORE PROCESSING... <span className="cta-cursor" style={{ animation: 'flicker 1s infinite' }}>█</span>
        </div>
      )}
      
      {!loading && (
        <form onSubmit={handleSubmit} className="term-line" style={{ display: 'flex', alignItems: 'center' }}>
          <span className="term-prompt">guest@system:~$</span>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoComplete="off"
            spellCheck="false"
            style={{ 
              background: 'transparent', border: 'none', color: 'var(--white)', 
              fontFamily: 'inherit', fontSize: 'inherit', flex: 1, outline: 'none', marginLeft: '8px'
            }}
          />
          <span className="term-cursor" aria-hidden="true" style={{ marginLeft: '2px' }}>█</span>
        </form>
      )}
    </div>
  );
}
