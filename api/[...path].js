export default async function handler(req, res) {
  const { path = [] } = req.query;
  const apiPath = Array.isArray(path) ? path.join('/') : path;
  
  const queryString = new URL(req.url, 'http://localhost').search;
  const apiUrl = `https://flyeastapi.webxnepal.com/api/v1/${apiPath}${queryString}`;

  try {
    const headers = {
      'Content-Type': req.headers['content-type'] || 'application/json',
      'Origin': 'https://flyeastadmin.webxnepal.com',
      'Referer': 'https://flyeastadmin.webxnepal.com/',
    };

    // Add authorization header if present
    if (req.headers.authorization) {
      headers['Authorization'] = req.headers.authorization;
    }

    const options = {
      method: req.method,
      headers,
    };

    // Add body for POST, PUT, PATCH, DELETE
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      options.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }

    const response = await fetch(apiUrl, options);
    const data = await response.text();
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Forward content-type from API
    const contentType = response.headers.get('content-type');
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }

    res.status(response.status).send(data);
  } catch (error) {
    console.error('API Proxy Error:', error);
    res.status(500).json({ error: 'Proxy request failed', message: error.message });
  }
}
