import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css';
import * as ROUTES from './routes/Routes'
import Footer from "./components/Footer";
import Header from "./components/Header";
import General from "./pages/General";
import PageNotFound from "./not_found/PageNotFound";
import Restaurant from "./pages/Restaurant";
import axios from 'axios';
import Data from "./context/data"
import React, { useEffect, useState, useRef } from 'react'
import CreateRestaurant from "./pages/CreateRestaurant";

function App() {
  const inputRef = useRef(null);

  const [general, setGeneral] = useState([]);

  const getImages = (id) => {
    !localStorage.getItem("restaurant_images") && localStorage.setItem("restaurant_images", '{}');
    let images = JSON.parse(localStorage.getItem("restaurant_images"));
    if(images["restaurantID:" + id]){
      return images["restaurantID:" + id]
    }else{
      images["restaurantID:" + id] = [];
      localStorage.setItem("restaurant_images", JSON.stringify(images));
    }
    return [];
  }

  const getAverage = (card) => {
    if(!card.ratings){
      return 0;
    }
    return Math.round(card.ratings.reduce((acc, val) => acc + val.rating, 0)/card.ratings.length);
  }

  const sortByRating = (general) => {
    general = general.sort((el , nextEl) => {
      return getAverage(nextEl) - getAverage(el);
    });
    return general;
  }

  const getGeneral = (data) => {
    let newData = data.map(el => (
        {
            id: +el.id,
            title: el.title || "",
            description: el.description || "",
            images: (getImages(el.id)) || [],
            geolocation: JSON.parse(el.geolocation) || {},
            ratings: JSON.parse(el.ratings),
        }
    ));
    
    setGeneral(sortByRating(newData));
  }
  const getData = () => {
    axios.get('http://localhost:3001/getData').then((response) => getGeneral(response.data)).catch((error) => console.log(error))
  }
  useEffect(() => {
    getData();
  },[])

  return (
    <Data.Provider value = {general}>
        <div className="main-container">
            <div className='main'>
              <React.Suspense fallback = {<h1>Loading...</h1>}>
                <Router>
                  <Switch>
                    <Route exact path={ROUTES.GENERAL}>
                        <General getData = {getData} inputRef = {inputRef}/>
                    </Route>
                    <Route path={ROUTES.CURRENT_RESTAURANT}>
                      <Header ref = {inputRef}/>
                        <Restaurant getImages={getImages}/>
                    </Route>
                    <Route path={ROUTES.ADD_RESTAURANT}>
                      <Header ref = {inputRef}/>
                        <CreateRestaurant/>
                    </Route>
                    <Route path={'*'}>
                      <Header ref = {inputRef}/>
                      <PageNotFound/>
                    </Route>
                  </Switch>
                </Router>
                <Footer/>
              </React.Suspense>
          </div>
        </div>
    </Data.Provider>
   
  );
}

export default App;
