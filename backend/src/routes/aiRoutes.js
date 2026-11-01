import { Router } from 'express'
import { authenticate } from '../middleware/authenticate.js'
import { analyzeProject } from '../controllers/analysisController.js'
import { blueprintProject } from '../controllers/blueprintController.js'

const router = Router()

router.use(authenticate)
router.post('/analyze', analyzeProject)
router.post('/blueprint', blueprintProject)

export default router
