import React, {useEffect} from 'react'
import { useHistory } from 'react-router-dom';
import * as ROUTES from "../routes/Routes"

function PageNotFound() {
    const history = useHistory();
    useEffect(() => {
      document.title = `Nothing Found`;
    }, []);
  return (
    <div 
        className = "page-not-found-container"
    >
        The Page is Not Found. <button onClick = {() => history.replace(ROUTES.GENERAL)} className = "back-to-menu">Back to Main Menu</button>
    </div>
  )
}

export default PageNotFound