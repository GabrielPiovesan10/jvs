export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { text, voice } = req.body;
  const apiKey = process.env.EASYVOICE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Chave de API não configurada' });
  }

  try {
    const response = await fetch('https://easyvoice.ae/api/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "tts-1", 
        input: text,    
        voice: voice || "af_aoede"
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Erro na API externa: Status ${response.status} - ${errorData}`);
    }

    const audioBuffer = await response.arrayBuffer();
    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(Buffer.from(audioBuffer));
    
  } catch (error) {
    console.error('Erro na API:', error);
    res.status(500).json({ error: error.message });
  }
}
