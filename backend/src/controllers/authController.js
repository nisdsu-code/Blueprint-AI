import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { User } from '../models/User.js'
import { httpError } from '../utils/httpError.js'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 8

function issueToken(user) {
  return jwt.sign({ sub: user.id }, env.jwtSecret, { expiresIn: env.jwtExpiresIn })
}

function readCredentials(body) {
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
  const password = typeof body?.password === 'string' ? body.password : ''
  return { email, password }
}

export async function register(req, res) {
  const name = typeof req.body?.name === 'string' ? req.body.name.trim() : ''
  const { email, password } = readCredentials(req.body)

  if (!name) throw httpError(400, 'Name is required')
  if (!EMAIL_PATTERN.test(email)) throw httpError(400, 'Please enter a valid email address')
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw httpError(400, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`)
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const user = await User.create({ name, email, passwordHash })

  res.status(201).json({ token: issueToken(user), user })
}

export async function login(req, res) {
  const { email, password } = readCredentials(req.body)

  if (!EMAIL_PATTERN.test(email) || !password) {
    throw httpError(400, 'Email and password are required')
  }

  const user = await User.findOne({ email }).select('+passwordHash')
  const isValid = user && (await bcrypt.compare(password, user.passwordHash))

  if (!isValid) throw httpError(401, 'Invalid email or password')

  res.json({ token: issueToken(user), user })
}

export async function currentUser(req, res) {
  const user = await User.findById(req.userId)

  if (!user) throw httpError(401, 'Account no longer exists. Please sign in again.')

  res.json({ user })
}
