import React, { useState, useEffect } from 'react'
import "../index.css";
import { BrowserRouter, Routes, Route, Link, redirect, useNavigate } from 'react-router-dom'
import Seasons from '../pages/seasons'
import Error from '../components/error'

const Register = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordTwo, setPasswordTwo] = useState('')
    const [valid, setValid] = useState(true)
    const [userId, setUserId] = useState('')
    const [error, setError] = useState({"state": false, "msg": "Your email or password is incorrect."})
    const navigate = useNavigate()

    useEffect(() => {
        //logout()
        const result = async () => {
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
        }).then((response) => 
            //if (response.status === 409)
                //setValid(false)
            response.json()
        ).then((json) => {
            setUserId(json._id)
            if (json.message === "already authorized")
                setValid(false)
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
        return navigate('/seasons/' + userId)
    }

    function handleName(event){
        setName(event.target.value)
    }

    function handleEmail(event){
        setEmail(event.target.value)
    }

    function handlePassword(event){
        setPassword(event.target.value)
    }

    function handlePasswordTwo(event){
        setPasswordTwo(event.target.value)
    }

    async function handleSubmit(e){
        e.preventDefault()
        try{

        if(password != passwordTwo){
            setError({"state": true, "msg": "Your passwords must match."})
            return
        }else if(password.length < 6){
            setError({"state": true, "msg": "Your password must be six characters."})
            return
        }

        const response = await apiCall()
        if (response.message === "Email Address Already Exists"){
            setError({"state": true, "msg": "This email address is already in use."})
            return
        }else if (response.message === "success"){
            setUserId(response.new_user._id)
            return navigate('/seasons/' + response.new_user._id)
        }else {
            setError({"state": true, "msg": "There was an error, try again."})
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
        const response = await fetch('/auth/register', {
            method: "POST",
            body: JSON.stringify({
                email: email,
                password: password,
                name: name
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
                    Name
                    <div>
                    <input className="authInput" type="text" value={name} onChange={handleName}/>
                    </div>
                </label>
                </div>
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
                <div className="labelInput">
                <label>
                    Re-enter Password
                    <div>
                    <input className="authInput"type="password" value={passwordTwo} onChange={handlePasswordTwo} />
                    </div>
                </label>
                </div>
                <button type="submit" className="authBtn" value="Login">Login</button>
            </form>


            
        </div>
        </div>
        <div className="container link">
            <p>Already have an account? <Link to='/login'>Login</Link></p>
        </div>
            </>
    )
}

export default Register