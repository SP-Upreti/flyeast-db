export default async function handler(req, res) {
  const { path } = req.query;
  const apiPath = Array.isArray(path) ? path.join('/') : path;
  
  const apiUrl = `https://flyeastapi.webxnepal.com/api/v1/${apiPath}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;

  try {
    const response = await fetch(apiUrl, {
      method: req.method,
      headers: {
        ...req.headers,
        'Origin': 'https://flyeastadmin.webxnepal.com',
        'Referer': 'https://flyeastadmin.webxnepal.com/',
        'host': 'flyeastapi.webxnepal.com',
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.text();
    
    // Forward all headers from the API response
    Object.entries(response.headers.raw()).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    res.status(response.status).send(data);
  } catch (error) {
    console.error('API Proxy Error:', error);
    res.status(500).json({ error: 'Proxy request failed' });
  }
}
