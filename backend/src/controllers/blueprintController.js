import { generateBlueprint } from '../services/aiServiceClient.js'
import { readProjectInput } from '../utils/projectInput.js'

export async function blueprintProject(req, res) {
  const input = readProjectInput(req.body)
  const blueprint = await generateBlueprint(input)

  res.json({ blueprint })
}
