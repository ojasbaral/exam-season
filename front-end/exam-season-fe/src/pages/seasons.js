//FIX THE WAY TO GET AND ADD PROJECTS

import React, { useState, useEffect } from 'react'
import Project from '../components/project'
import ProjectList from '../components/projectList'
import { Routes, Route, useParams, useNavigate } from 'react-router-dom'
import { refreshUserToken, checkCallback } from '../utilities/helper'

const Seasons = () => {
  const [login, setLogin] = useState(false)
  const [seasons, setSeasons] = useState([])
  const [newSeason, setNewSeason] = useState('')
  const [name, setName] = useState('')
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    async function effect(){
      const valid = await refreshUserToken()
      setLogin(valid)
      getSeasons()
      return () => {}
    }
    effect()
  }, [])

  if (login){
    navigate('/login')
  }

  async function getSeasons(){
    const valid = await refreshUserToken()
    setLogin(valid)
    if (login){
      navigate('/login')
    }
    try{
        await fetch(('/projects/' + id), {
        method: "GET"
      }).then((response) => response.json())
      .then((json) => {
        const valid = checkCallback(json)
        if(valid === 0){
          setSeasons(json.projects.reverse())
          setName(json.name)
        }else if(valid === 1){
          navigate('/login')
        }
      })
    } catch (e) {
      console.log(e)
    }
  }


  function handleNewSeason(event){
    setNewSeason(event.target.value)
  }

  function handleSubmit(event) {
    if(event.key === 'Enter'){
      addSeason()
      setNewSeason("")
    }
  }

  async function addSeason(){
    try{
      const refresh = await refreshUserToken()
      setLogin(refresh)
      if (login){
        navigate('/login')
      }
      await fetch('/projects', {
        method: "POST",
        body: JSON.stringify({
          user_id: id,
          title: newSeason
        }),
        headers: {
              "Content-type": "application/json; charset=UTF-8"
          }
      }).then((response) => response.json())
      .then((json) => {
        const valid = checkCallback(json)

        if(valid === 0){
          getSeasons()
        }else if(valid === 1){
          navigate('/login')
        }
      })
    }catch (e){
      console.log(e)
    }
  }
  
  return (
    <div className="container">
      <div className="name"><h1>Good Luck, {name}</h1></div>

      <ProjectList seasons={seasons}></ProjectList>
    <div className="projectBox">
        
              
                    <h1>Add Season:</h1>
                    <div>
                    
                    <input className="addInput" type="text" value={newSeason} onChange={handleNewSeason} onKeyDown={handleSubmit}/>
                    </div>

            
      </div>
    </div>
  )
}

export default Seasons