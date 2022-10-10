import React, {forwardRef, useState} from 'react'
import { useHistory } from 'react-router-dom';
import * as ROUTES from "../routes/Routes"


const Header = forwardRef(({onReRender}, ref) => {
    const [val, setVal] = useState("");
    const history = useHistory();

    const handleInputChange = (event) => {
        setVal(event.target.value);
        !event.target.value && onReRender();
    }

    return (
        <div className = "header">
        <div className = "title-container">
            <h1 onClick={() => history.replace('/')}>Restaurants</h1>
        </div>
        <div className = "search-input-container">
            <div className = 'search-container'>
                
                <input className = {`search-input ${history.location.pathname === '/' ? 'visible' : 'hidden'}`} onChange = { handleInputChange } ref = {ref} type = "text" placeholder="Search..."/>
                <button onClick = {() => {val.length && onReRender()}} className = {`search-button ${ val.length ? "search-active" : "search-disabled" } ${`${history.location.pathname === '/' ? 'visible' : 'hidden'}`}`}>Search</button>
            </div>
        </div>
        <div className="menu-buttons-container">
            <ul>
                <li onClick={() => history.replace('/')}>Home</li>
                <li onClick={() => history.replace(ROUTES.ADD_RESTAURANT)}>New</li>
                <li><a target = "_blank" href = "https://www.linkedin.com/in/vahan-zakaryan-4604aa147/">Linked In</a></li>
            </ul>
        </div>
    </div>
  )
})

export default Header