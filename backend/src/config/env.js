import dotenv from 'dotenv'

dotenv.config({ path: new URL('../../.env', import.meta.url) })

const required = ['MONGO_URI', 'JWT_SECRET', 'AI_SERVICE_TOKEN']

for (const name of required) {
  if (!process.env[name]) {
    throw new Error(`Missing required environment variable: ${name}. Add it to backend/.env`)
  }
}

export const env = {
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  aiServiceUrl: process.env.AI_SERVICE_URL || 'http://localhost:8000',
  aiServiceToken: process.env.AI_SERVICE_TOKEN,
}
