const mongoose = require('mongoose')
const Project = require('../models/projectModel')
const Exam = require('../models/examModel')
const { response } = require('express')
const User = require('../models/userModel')

const addExam = async (req, res) => {
    try{
        //ADD DATE FEAUTURE
        const user_id = req.body.user_id
        const project_id = req.body.project_id
        const class_name = req.body.class_name
        const exam_name = req.body.exam
        //const date = req.body.date

        const project = await Project.findOne({ _id: project_id })
        if (!project) return res.status(404).send({ message: "project not found" })
        if(project._user != user_id) return res.status(401).send({ message: "unauthenticated" })
        if (req.body.desc){
            const exam = new Exam({_project: project_id, _user: user_id, class: class_name, exam_name: exam_name, description: req.body.desc })
            await exam.save()
            project._exams.push(exam)
            await project.save()
        }else {
            const exam = new Exam({_project: project_id, _user: user_id, class: class_name, exam_name: exam_name})
            await exam.save()
            project._exams.push(exam)
            await project.save()
        }



        return res.send({ message: "success", user_id: user_id, project_id: project_id })

    } catch (e) {
        return res.send(e)
    }
}

const getExam = async (req, res) => {
    try{
        const project_id = req.params.id
        const project = await Project.findOne({ _id: project_id }).populate('_exams').exec()
        
        return res.send({ message: "success", title: project.title, project_id: project._id, exams: project._exams })
    } catch (e) {
        return res.send(e)
    }
}

const editExam = async (req, res) => {
    try{
        const user_id = req.body.user_id
        const project_id = req.body.project_id
        const exam_id = req.body.exam_id
        const class_name = req.body.class_name
        const exam_name = req.body.exam
        const desc = req.body.desc

        const exam = await Exam.findOne({ _id: exam_id })
        if(!exam) return red.status(404).send({ message: "exam not found" })

        const user = await User.findOne({ _id: exam._user })
        if(!user) return red.status(404).send({ message: "user not found" })

        if((exam._user).toString() != (user._id).toString()) return res.status(401).send({ message: "unauthenticated" })
        exam.class = class_name
        exam.exam_name = exam_name
        exam.description = desc

        await exam.save()
        return res.send({ message: "success", owner: user._id, project: project_id })
    } catch (e) {
        res.send(e)
    }
}

const delExam = async (req, res) => {
    try{
        const project_id = req.body.project_id
        const exam_id = req.body.exam_id

        const project = await Project.findOne({ _id: project_id }).populate('_exams').exec()
        const exam = await Exam.findOne({ _id: exam_id })

        if (!project) return res.status(404).send({ message: "project not found" })
        if (!exam) return res.status(404).send({ message: "exam not found" })

        if ((exam._project).toString != (project._id).toString) return res.status(401).send({ message: "unauthenticated" })

        project._exams.pull({ _id: exam_id })
        project.save()

        await exam.deleteOne()

        return res.send({ message: "success", project_id: project_id })
    } catch (e) {
        return res.send(e)
    }

}

module.exports = { addExam, getExam, editExam, delExam }