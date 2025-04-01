export const handler = async (event, context) => {
  // Always respond successfully to any type of request
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    },
    body: JSON.stringify({
      status: "online",
      message: 'Netlify Functions are working!',
      timestamp: new Date().toISOString(),
      environment: {
        node_version: process.version,
        has_api_keys: {
          openai: Boolean(process.env.OPENAI_API_KEY),
          anthropic: Boolean(process.env.ANTHROPIC_API_KEY)
        }
      }
    })
  };
}; 