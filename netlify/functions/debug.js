export const handler = async (event, context) => {
  // Collect environment information
  const environment = {
    node_version: process.version,
    env_variables: {
      NODE_ENV: process.env.NODE_ENV,
      NETLIFY: process.env.NETLIFY,
      CONTEXT: process.env.CONTEXT,
      DEPLOY_URL: process.env.DEPLOY_URL,
      SITE_NAME: process.env.SITE_NAME,
      ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY ? "Set (redacted)" : "Not set",
      OPENAI_API_KEY: process.env.OPENAI_API_KEY ? "Set (redacted)" : "Not set",
    },
    event_method: event.httpMethod,
    event_path: event.path,
    event_headers: Object.keys(event.headers),
    context_keys: Object.keys(context),
    timestamp: new Date().toISOString()
  };

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
    },
    body: JSON.stringify({
      message: "Netlify Function Debug Information",
      environment
    })
  };
}; 