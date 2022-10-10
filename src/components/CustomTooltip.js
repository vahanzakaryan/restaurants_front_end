import React from 'react'
import '../App.css'

function CustomTooltip({description}) {
  return (
    <div
        className = "custom-tooltip"
    >
        {description}
    </div>
  )
}

export default CustomTooltip