import cors from 'cors'
import express from 'express'
import { env } from './config/env.js'
import authRoutes from './routes/authRoutes.js'
import projectRoutes from './routes/projectRoutes.js'
import aiRoutes from './routes/aiRoutes.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'

const app = express()

app.use(cors({ origin: env.clientOrigin }))
app.use(express.json({ limit: '300kb' }))

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/ai', aiRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
