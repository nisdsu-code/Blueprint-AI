import mongoose from 'mongoose'

export const PROJECT_STATUSES = ['draft', 'in-progress', 'completed']

const clarificationSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true, maxlength: 300 },
    answer: { type: String, required: true, trim: true, maxlength: 1000 },
  },
  { _id: false },
)

const projectSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    category: { type: String, trim: true, maxlength: 60, default: 'General' },
    requirement: { type: String, required: true, trim: true, minlength: 20, maxlength: 5000 },
    clarifications: { type: [clarificationSchema], default: [] },
    blueprint: { type: mongoose.Schema.Types.Mixed, default: null },
    status: { type: String, enum: PROJECT_STATUSES, default: 'draft' },
  },
  { timestamps: true },
)

projectSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
    delete ret.owner
    return ret
  },
})

export const Project = mongoose.model('Project', projectSchema)
