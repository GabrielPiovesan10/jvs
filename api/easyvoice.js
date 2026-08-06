export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const apiKey = process.env.EASYVOICE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Chave de API não configurada' });
  }

  try {
    // Se você acessar /api/easyvoice pelo navegador, ele lista as vozes disponíveis na sua chave
    if (req.method === 'GET') {
      const responseVozes = await fetch('https://easyvoice.ae/api/v1/voices', {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });
      
      if (!responseVozes.ok) {
        throw new Error(`Erro ao buscar vozes: Status ${responseVozes.status}`);
      }
      
      const dadosVozes = await responseVozes.json();
      return res.status(200).json(dadosVozes);
    }

    // Se for POST, gera o áudio normalmente (usando 'af_aoede' ou a voz que passar)
    const { text, voice } = req.body;
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
