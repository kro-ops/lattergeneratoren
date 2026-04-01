export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, theme } = req.body;

  if (!name || !theme) {
    return res.status(400).json({ error: 'Navn og tema er påkrevd' });
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 256,
      messages: [{
        role: 'user',
        content: `Skriv én kort, morsom norsk vits om en person som heter "${name}" med temaet "${theme}". Vitsen skal være på norsk, maks 2-3 setninger, og passe for alle aldersgrupper. Svar kun med selve vitsen, ingen introduksjon eller forklaring.`
      }]
    })
  });

  if (!response.ok) {
    return res.status(500).json({ error: 'Klarte ikke å generere vits' });
  }

  const data = await response.json();
  res.status(200).json({ joke: data.content[0].text });
}
