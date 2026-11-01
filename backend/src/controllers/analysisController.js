import { analyzeRequirement } from '../services/aiServiceClient.js'
import { readProjectInput } from '../utils/projectInput.js'

export async function analyzeProject(req, res) {
  const input = readProjectInput(req.body)
  const analysis = await analyzeRequirement(input)

  res.json({ analysis })
}
