const mongoose = require('mongoose')
const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
require('dotenv').config()

const saltRounds = process.env.BCRYPT_SALT
const bcryptPass = process.env.BCRYPT_PASS
const jwtAccessPass = process.env.JWT_ACCESS_PASS
const jwtRefreshPass = process.env.JWT_REFRESH_PASS
const state = process.env.STATE

function genJwt(user, res){
    const accessToken = jwt.sign({ user_id: user._id }, jwtAccessPass, { expiresIn: "15m" })
    const refreshToken = jwt.sign({ user_id: user._id }, jwtRefreshPass, { expiresIn: "7d"})

    res.cookie("access_token", accessToken, {
        httpOnly: true,
        maxAge: (5 * 60 * 1000),
        sameSite: 'None',
        //secure: true
    })

    res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        maxAge: (7 * 24 * 60 * 60 * 1000),
        sameSite: 'None',
        //secure: true,
        path: '/auth'
    })
}

function checkLoginAuth(req, res, next){
    if (req.cookies.refresh_token){
        const refreshToken = req.cookies.refresh_token

        jwt.verify(refreshToken, jwtRefreshPass, (err, decoded) => {
            if (err){
                next()
            } else {
                return res.status(409).send({ message: 'already authorized', _id: decoded.user_id})
            }
        })
    } else {
        next()
    }
}

function checkLogoutAuth(req, res, next) {
    if (req.cookies.refresh_token){
        const refreshToken = req.cookies.refresh_token

        jwt.verify(refreshToken, jwtRefreshPass, (err, decoded) => {
            if (err){
                console.log(err)
                return res.status(401).send({ message: "unauthorized" })
            } else {
                next()
            }
        })
    } else {
        return res.status(401).send({ message: "unauthorized" })
    }
}
    

const register = async (req, res) => {
    try {
        // parse the request
        email = req.body.email
        password = req.body.password

        // check if the user already exists
        const searchForUser = await User.findOne({ email: email })
        if (searchForUser) return res.status(400).send({ message: 'Email Address Already Exists'})

        // hash password
        const hashedPassword = await bcrypt.hash(password, parseInt(saltRounds))

        // save user in db
        const new_user = new User({ name: req.body.name, email: email, password: hashedPassword })
        await new_user.save()

        genJwt(new_user, res)

        return res.send({ message: "success", new_user})
    } catch (err) {
        return res.send(err)
    }
}

const login = async (req, res) => {
    try{
        email = req.body.email
        password = req.body.password

        const user = await User.findOne({ email: email })
        if (user){
            const verified = await bcrypt.compare(password, user.password)
            if(verified){
                genJwt(user, res)
                return res.send({ message: "success", user})
            }
        }
        return res.status(401).send({ message: 'unauthorized' })

        
} catch (err) {
    return res.send(err)
}
}

const refresh = (req, res) => {
    if (req.cookies.refresh_token){
        const refreshToken = req.cookies.refresh_token

        jwt.verify(refreshToken, jwtRefreshPass, (err, decoded) => {
            if (err){
                return res.status(401).send({ message: 'unauthorized'})
            } else {
                const accessToken = jwt.sign({ user_id: decoded._id }, jwtAccessPass, { expiresIn: "15m" })

                res.cookie("access_token", accessToken, {
                    httpOnly: true,
                    maxAge: (5 * 60 * 1000),
                    sameSite: 'None',
                    //secure: true
                })

                return res.status(200).send({ message: 'success'})

            }
        })
    } else {
        return res.status(401).send({ message: 'unauthorized'})
    }
}

const logout = (req, res) => {
    res.clearCookie('refresh_token', {
        httpOnly: true,
        maxAge: (7 * 24 * 60 * 60 * 1000),
        sameSite: 'None',
        //secure: true,
        path: '/auth'
    })
    res.clearCookie('access_token', {
                    httpOnly: true,
                    maxAge: (5 * 60 * 1000),
                    sameSite: 'None',
                    secure: true
                })
    res.send({ message: 'cookies cleared'})
}

module.exports = { register, refresh, login, checkLoginAuth, logout, checkLogoutAuth }