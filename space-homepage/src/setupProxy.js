module.exports = function(app) {
  app.post('/api/chat', (req, res) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        const { messages } = JSON.parse(body || '{}');
        const apiKey = process.env.GROQ_API_KEY || process.env.REACT_APP_GROQ_API_KEY || '';
        
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'llama-3.1-8b-instant',
            messages: [
              { 
                role: "system", 
                content: "You are ARISTRO's System Core, a highly advanced artificial intelligence managing Debajit Dutta's portfolio interface. You respond concisely in a robotic, sci-fi tone. Keep answers under 3 sentences. Debajit is a CS student building cool stuff." 
              },
              ...(messages || [])
            ],
            temperature: 0.7,
            max_tokens: 150
          })
        });

        const data = await response.json();
        if (!response.ok) {
          console.error('Groq API Error:', data);
          return res.status(response.status).json({ error: data.error?.message || 'API error' });
        }
        res.status(200).json(data);
      } catch (error) {
        console.error('Local Proxy Error:', error);
        res.status(500).json({ error: 'Failed to communicate with System Core.' });
      }
    });
  });
};
