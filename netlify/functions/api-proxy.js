const https = require('https');

exports.handler = async (event, context) => {
  // Only allow from your domain
  const origin = event.headers.origin || event.headers.referer;
  
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS'
      },
      body: ''
    };
  }

  try {
    const path = event.path.replace('/.netlify/functions/api-proxy', '');
    const url = `https://flyeastapi.webxnepal.com/api/v1${path}`;
    
    const options = {
      method: event.httpMethod,
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://flyeastadmin.webxnepal.com',
        'Referer': 'https://flyeastadmin.webxnepal.com/dashboard/',
        ...(event.headers.authorization && { 'Authorization': event.headers.authorization })
      }
    };

    const response = await fetch(url + (event.queryStringParameters ? '?' + new URLSearchParams(event.queryStringParameters) : ''), {
      ...options,
      body: event.body || undefined
    });

    const data = await response.text();

    return {
      statusCode: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Content-Type': response.headers.get('content-type') || 'application/json'
      },
      body: data
    };
  } catch (error) {
    console.error('Proxy error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};
