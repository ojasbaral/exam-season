const mongoose = require('mongoose')
const User = require('../models/userModel')
const Project = require('../models/projectModel')
const { response } = require('express')

const addProject = async (req, res) => {
    try{
        const user_id = req.body.user_id
        const title = req.body.title

        const owner = await User.findOne({ _id: user_id })
        if(owner === undefined) return res.status(401).send({ message: "unauthenticated" })

        const newProject = new Project({ title: title, _user: owner })
        await newProject.save()
        owner._projects.push(newProject)
        await owner.save()
        return res.send({ message: "success", user_id: user_id })
    } catch (e) {
        return res.send(e)
    }
}

const getProjects = async (req, res) => {
    try{
        const user_id = req.params.id
        const owner = await User.findOne({ _id: user_id}).populate('_projects').exec() 
        
        return res.send({ message: "success", name: owner.name, owner: user_id, projects: owner._projects })
    } catch (e) {
        return res.send(e)
    }
}

const editProject = async (req, res) => {
    try{
        const newTitle = req.body.title
        const projectId = req.body.project_id
        const userId = req.body.user_id

        const project = await Project.findOne({ _id: projectId })
        if (!project) return res.status(404).send({ message: "project not found" })
        
        const user = await User.findOne({ _id: userId })
        if (!user) return res.status(404).send({ message: "user not found" })
                
        if ((project._user).toString != (user._id).toString) return res.status(401).send({ message: "unauthorized"})
        
        project.title = newTitle
        await project.save()
        return res.send({ message: "success", owner: user._id, project: project._id })
    } catch (e) {
        return res.send(e)
    }
}


const delProject = async (req, res) => {
    try{
        const userId = req.body.user_id
        const projectId = req.body.project_id
        
        const user = await User.findOne({ _id: userId }).populate('_projects').exec()
        const project = await Project.findOne({ _id: projectId })
        
        if (!project) return res.status(404).send({ message: "project not found" })
        if (!user) return res.status(404).send({ message: "user not found" })

        if ((project._user).toString != (user._id).toString) return res.status(401).send({ message: "unauthorized"})

        user._projects.pull({ _id: projectId})
        user.save()
        
        await project.deleteOne()

        return res.send({ message: 'success', user_id: userId})

    } catch (e) {
        return res.send(e)
    }
}



module.exports = { addProject, getProjects, editProject, delProject }