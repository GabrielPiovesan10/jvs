export default async function handler(req, res) {
  // Bloqueia qualquer requisição que não seja um POST padrão
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { text } = req.body;
  const apiKey = process.env.EASYVOICE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Chave de API não configurada nas variáveis de ambiente do Vercel.' });
  }

  try {
    // ATENÇÃO: Confirme na documentação do EasyVoice qual é a URL exata deles. 
    // Coloquei uma genérica abaixo, você pode precisar substituir se for diferente.
    const urlDaApi = 'https://api.easyvoice.com/v1/text-to-speech'; 

    const response = await fetch(urlDaApi, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: text,
        // Caso o EasyVoice exija o nome da voz escolhida no código, você adiciona aqui:
        // voice: "nome_da_voz_escolhida",
        // language: "pt-BR"
      })
    });

    if (!response.ok) {
      throw new Error(`Erro de autenticação ou falha na API externa: Status ${response.status}`);
    }

    // Pega o áudio gerado pelo EasyVoice em formato binário
    const audioBuffer = await response.arrayBuffer();
    
    // Devolve o áudio diretamente para o seu HTML tocar
    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(Buffer.from(audioBuffer));
    
  } catch (error) {
    console.error('Erro na requisição da API de voz:', error);
    res.status(500).json({ error: 'Falha interna no servidor ao gerar o áudio' });
  }
}
