export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const API_KEY = process.env.GEMINI_API_KEY; 

  if (!API_KEY) {
    return res.status(500).json({ error: 'Chave da API não encontrada nas variáveis da Vercel.' });
  }

  // Endpoint configurado para a versão 3.1 Flash Lite
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${API_KEY}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error ? data.error.message : 'Erro na API do Google');
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
