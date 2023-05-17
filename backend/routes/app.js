const express = require('express')
const router = express.Router()
const projectController = require('../controllers/projectController')
const examController = require('../controllers/examController')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const Project = require('../models/projectModel')

const jwtAccessPass = process.env.JWT_ACCESS_PASS

/*
router.use(async (next) => {
    const proj = await Project.deleteOne({ _id: '644a1dcbe0595d74341a2168' })
    next()
})
*/
router.use(authUser)

function authUser(req, res, next){
    if(req.cookies.access_token){
        const access_token = req.cookies.access_token

        jwt.verify(access_token, jwtAccessPass, function(err, decoded){
            if(err){
                return res.status(401).send({ message: "unauthorized"})
            }else{
                next()
            }
        })

    } else {
        return res.status(401).send({ message: 'unauthorized'})
    }
}


// PROJECTS
router.post('/projects', projectController.addProject)

router.get('/projects/:id', projectController.getProjects)

router.put('/projects', projectController.editProject)

router.delete('/projects', projectController.delProject)


// EXAMS
router.post('/exams', examController.addExam)

router.get('/exams/:id', examController.getExam)

router.put('/exams', examController.editExam)

router.delete('/exams', examController.delExam)

// TASKS




module.exports = router