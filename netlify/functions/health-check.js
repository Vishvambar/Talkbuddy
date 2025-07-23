// Health check function to verify deployment
export const handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const healthInfo = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      function: 'health-check',
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        hasGroqKey: !!process.env.GROQ_API_KEY,
        hasMongoUri: !!process.env.MONGODB_URI,
        netlifyContext: context.clientContext ? 'present' : 'missing'
      },
      event: {
        httpMethod: event.httpMethod,
        path: event.path,
        headers: Object.keys(event.headers || {}),
        queryStringParameters: event.queryStringParameters
      }
    };

    console.log('Health check info:', JSON.stringify(healthInfo, null, 2));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(healthInfo, null, 2)
    };

  } catch (error) {
    console.error('Health check error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        status: 'error',
        message: error.message,
        stack: error.stack
      }, null, 2)
    };
  }
};
