import React from 'react'

function FullScreenImage({image, handleClose}) {
  return (
    <React.Fragment>
        <div className = "ful-size-image-container" style = {{backgroundImage:`url(${image})`, backgroundPosition:"center"}}/>
        <div className = 'image-container-background'/>
        <span className = 'deleter-button' onClick={handleClose} >X</span>
    </React.Fragment>
   

  )
}

export default FullScreenImage