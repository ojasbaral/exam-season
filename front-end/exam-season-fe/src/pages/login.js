import React, { useState, useEffect } from 'react'
import "../index.css";
import { BrowserRouter, Routes, Route, Link, redirect, useNavigate } from 'react-router-dom'
import Seasons from '../pages/seasons'
import Error from '../components/error'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [valid, setValid] = useState(true)
    const [userId, setUserId] = useState('')
    const [error, setError] = useState({"state": false, "msg": "Your email or password is incorrect."})
    const navigate = useNavigate()

    useEffect(() => {
        //logout()
        const result = async () => {
            try{
        await fetch('/auth/login', {
            method: "POST",
            body: JSON.stringify({
                email: email,
                password: password
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then((response) => response.json()).
        then((json) => {
            setUserId(json._id)
            if (json.message === "already authorized"){
                setValid(false)
            }
            //console.log(json)
            return () => {}
        })
    } catch (e) {
        console.log(e)
    }
        }
        result()
    }, [])

    if(!valid){
        return navigate("/seasons/" + userId)
    }

    function handleEmail(event){
        setEmail(event.target.value)
    }

    function handlePassword(event){
        setPassword(event.target.value)
    }

    async function handleSubmit(e){
        e.preventDefault()
        try{

        const response = await apiCall()
        if (response.message === "success"){
            setUserId(response.user._id)
            return navigate('/seasons/' + response.user._id)
        }else {
            setError({"state": true, "msg": "Your email or password is incorrect."})
        }

        }catch (e){
            console.log("Error:", e);
        }
    }

    async function logout(){
        try{

            const response = await fetch('/auth/logout', {
                method: 'GET',
                credentials: "include",
                redirect: "follow",
                headers: {
                "Content-type": "application/json; charset=UTF-8"
                }
            }).then((res) => res.json()).then((json) => {
                return json
            })

            console.log(response)


        }catch (e){
            console.log(e)
        }
    }

    async function apiCall(){
        try{
        const response = await fetch('/auth/login', {
            method: "POST",
            body: JSON.stringify({
                email: email,
                password: password
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then((response) => response.json()).then((json) => {
            return json
        })

        return response
    } catch (e) {
        console.log(e)
    }
    }

    return (
        <>
        <div className="container">
        <div className="authBox">
            <Error error={error} />
            <form onSubmit={handleSubmit}>
                <div className="labelInput">
                <label>
                    Email
                    <div>
                    <input className="authInput" type="email" value={email} onChange={handleEmail}/>
                    </div>
                </label>
                </div>
                <div className="labelInput">
                <label>
                    Password
                    <div>
                    <input className="authInput"type="password" value={password} onChange={handlePassword} />
                    </div>
                </label>
                </div>
                <button type="submit" className="authBtn" value="Login">Login</button>
            </form>


            
        </div>
        </div>
        <div className="container link">
            <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
            </>
    )
}

export default Login