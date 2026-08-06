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
    const urlDaApi = 'https://easyvoice.ae/api/v1/audio/speech';

    const response = await fetch(urlDaApi, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "tts-1", 
        input: text,    
        voice: voice || "am_michael" // Usa a voz escolhida ou uma padrão segura
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Erro da API EasyVoice:", errorData);
      throw new Error(`Erro na API externa: Status ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();
    
    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(Buffer.from(audioBuffer));
    
  } catch (error) {
    console.error('Erro na requisição da API de voz:', error);
    res.status(500).json({ error: error.message });
  }
}
