import { isValidObjectId } from 'mongoose'
import type { Request, Response, NextFunction } from 'express'
import Project, { IProject } from '../models/Project'

declare global {
    namespace Express {
        interface Request {
            project: IProject
        }
    }
}

export const projectExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { projectId } = req.params
        if (!isValidObjectId(projectId)) {
            res.status(400).json({ message: 'Invalid project ID' })
            return
        }
        const project = await Project.findById(projectId)
        if (!project) {
            res.status(404).json({ message: 'Project not found' })
            return
        }
        req.project = project
        next()
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}