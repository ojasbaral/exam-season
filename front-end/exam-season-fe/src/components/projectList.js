import React from 'react'
import Project from '../components/project'

const ProjectList = ({ seasons }) => {
  return (
    <>
        {seasons.map((season, index) => (
            <Project key={index} season={season}></Project>
        ))}
    </>
  )
}

export default ProjectList