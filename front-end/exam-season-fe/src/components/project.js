import React, { useState, useEffect } from 'react'
import { Routes, Route, useParams, useNavigate } from 'react-router-dom'
import { refreshUserToken, checkCallback } from '../utilities/helper'



const Project = ({ season }) => {
  const [del, setDel] = useState("Delete")
  const [vis, setVis] = useState(true)
  const [login, setLogin] = useState(false)
  const navigate = useNavigate()

  async function handleDelClick(){
    if (del === "Delete")
      setDel("Confirm")
    else {
      const refresh = await refreshUserToken()
      setLogin(refresh)
      if (login){
        navigate('/login')
      }

      await fetch('/projects', {
        method: "DELETE",
        body: JSON.stringify({
          user_id: season._user,
          project_id: season._id
        }),
        headers: {
              "Content-type": "application/json; charset=UTF-8"
          }
      }).then((response) => response.json())
      .then((json) => {
        if (json.message === "success"){
          setVis(false)
        } else {
          console.log("err")
        }
      })
    }
  }
  if(vis){
  return (
     <>
        <div className="projectBox" >
            <h1>{season.title}</h1>
            <div className="projectLabel">
            <p className="date">Created {
              season.createdAt.toString().substring(0, 10)
            }</p>
            <a className="trash" onClick={handleDelClick}>{del}</a>
            </div>
        </div>

    </>
  )
} else {
  return (<></>)
}
}

export default Project