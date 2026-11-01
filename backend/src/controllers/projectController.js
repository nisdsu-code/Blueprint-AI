import mongoose from 'mongoose'
import { PROJECT_STATUSES, Project } from '../models/Project.js'
import { httpError } from '../utils/httpError.js'
import { readProjectInput } from '../utils/projectInput.js'

const LIST_FIELDS = 'name category status createdAt updatedAt'

async function findOwnedProject(req) {
  if (!mongoose.isValidObjectId(req.params.id)) throw httpError(404, 'Project not found')

  const project = await Project.findOne({ _id: req.params.id, owner: req.userId })
  if (!project) throw httpError(404, 'Project not found')

  return project
}

export async function listProjects(req, res) {
  const projects = await Project.find({ owner: req.userId }).select(LIST_FIELDS).sort({ updatedAt: -1 })

  res.json({ projects })
}

export async function getProject(req, res) {
  const project = await findOwnedProject(req)

  res.json({ project })
}

export async function createProject(req, res) {
  const input = readProjectInput(req.body)
  const project = await Project.create({ ...input, owner: req.userId })

  res.status(201).json({ project })
}

export async function deleteProject(req, res) {
  const project = await findOwnedProject(req)
  await project.deleteOne()

  res.status(204).end()
}

export async function updateProject(req, res) {
  const project = await findOwnedProject(req)
  const status = req.body?.status ?? project.status
  if (!PROJECT_STATUSES.includes(status)) throw httpError(400, 'Project status is invalid')

  project.set({ ...readProjectInput(req.body), status })
  await project.save()

  res.json({ project })
}
