const express = require('express')
const router =  express.Router()
const User = require('../models/userModel')
const userController = require('../controllers/userController')

router.post('/register', userController.register)
   
router.post('/login', userController.checkLoginAuth, userController.login)

router.post('/refresh', userController.refresh)

router.get('/logout', userController.checkLogoutAuth, userController.logout)

module.exports = router