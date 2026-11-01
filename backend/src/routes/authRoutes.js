import { Router } from 'express'
import { authenticate } from '../middleware/authenticate.js'
import { currentUser, login, register } from '../controllers/authController.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get('/me', authenticate, currentUser)

export default router
