import React from 'react'

const Error = ( { error } ) => {

    if(error.state)
  return (
    <div className="errorMsg">
            <p className="errorText">{error.msg}</p>
    </div>
  )
  else {
    return (<></>)
  }
}

export default Error
