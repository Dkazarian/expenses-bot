import dotenv from 'dotenv';
dotenv.config();

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const config = {
  botService: {
    url: requireEnv('BOT_SERVICE_URL'),
    apiKey: requireEnv('BOT_SERVICE_API_KEY'),
  },
  botToken: requireEnv('BOT_TOKEN'),
};
