import type { Request, Response } from "express"
import User from "../models/User"
import Project from "../models/Project"

export class TeamController {
    static findMemberByEmail = async (req: Request, res: Response) => {
        const { email } = req.body

        // Find user
        const user = await User.findOne({ email}).select('id name email')
        if(!user) {
            res.status(404).json({message: 'User not found'})
            return
        }
        res.json(user)
    }

    static getProjectTeam = async (req: Request, res: Response) => {
        const project = await (await Project.findById(req.project.id)).populate({
            path: 'team',
            select: 'id email name'
        })
        if(!project) {
            res.status(404).json({message: 'Project not found'})
            return
        }
        res.json(project.team)
    }

    static addUserById = async (req: Request, res: Response) => {
        const { id } = req.body

        // Find user
        const user = await User.findById(id).select('id')
        if(!user) {
            res.status(404).json({message: 'User not found'})
            return
        }
        if(req.project.team.some(member => member.toString() === user.id.toString())) {
            res.status(409).json({message: 'User already in team'})
            return
        }
        if(req.project.manager.toString() === user.id.toString()) {
            res.status(409).json({message: 'You cannot add yourself'})
            return
        }
        req.project.team.push(user.id)
        await req.project.save()
        res.send('User added to team')
    }

    static removeUserById = async (req: Request, res: Response) => {
        const { userId } = req.params
        if(!req.project.team.some(member => member.toString() === userId)) {
            res.status(404).json({message: 'User not in team'})
            return
        }
        req.project.team = req.project.team.filter(member => member.toString() !== userId)
        await req.project.save()
        res.send('User removed from team')
    }
}