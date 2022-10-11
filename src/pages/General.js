import React, { useState, useContext, useEffect, forwardRef } from 'react'
import RestaurantCard from '../components/RestaurantCard'
import '../App.css'
import Map from '../google_map/Map';
import NotFound from '../not_found/NotFound';
import Data from '../context/data';
import Header from '../components/Header';
import * as ROUTES from "../routes/Routes";
import { useHistory } from 'react-router-dom';

const General = ({inputRef, getData}) => {
    const general = useContext(Data);
    const history = useHistory();

    const [reRender, setReRender] = useState(false);
    const [geoLocation, setGeolocation] = useState({lat: 8, lng: 9});
    const [description, setDescription] = useState("");
    const [title, setTitle] = useState("");
    const [show, setShow] = useState(false);
    const [activeCard, setActiveCard] = useState(null);


    const handleReRender = () => {    
        setReRender(!reRender);   
        setShow(false);
    };

    const validQuantity = () => {
        if(!inputRef.current){
            return;
        }
        let count = 0;
        general.length && general.map(el => {
            if(el.title.includes(inputRef.current.value) || inputRef.current.value.includes(el.title) ||  el.description.includes(inputRef.current.value) || inputRef.current.value.includes(el.description)) 
                count++;
        })
        return count;
    }

    const storeRestaurantInfo = (card) => {
        history.push(ROUTES.CURRENT_RESTAURANT + card.id);
    }

    const handleCardChange = (card) => {
        setGeolocation(card.geolocation);
        setDescription(card.description);
        setTitle(card.title);
        setActiveCard(card);
        !show && setShow(true);
    }    

    const markerOnClick = () => {
        storeRestaurantInfo(activeCard);
    }

    useEffect(() => {
        document.title = 'Home: Restaurants';
        getData();
    }, [])

    return (
        <React.Fragment>
            <Header onReRender = {handleReRender} ref = {inputRef}/>
            <div className='flex-container'>
                {
                    validQuantity() || !inputRef.current ? <>
                         <div className='list-container'>
                            <center>
                            <h1>Click on the card to see the location!</h1>
                            {
                                general.map((el, index) => (
                                    (el.title.includes(inputRef.current.value) || inputRef.current.value.includes(el.title) ||  el.description.includes(inputRef.current.value) || inputRef.current.value.includes(el.description)) || !inputRef.current ? 
                                    <div
                                        className='card-holder'
                                        key = {index}
                                        onClick = {() => handleCardChange(el)}
                                    >
                                        {
                                            <RestaurantCard storeRestaurantInfo = {(val) => storeRestaurantInfo(val)} card = {el} image = {el.images.length ? el.images[0] : 'no-image'} />
                                        }
                                    </div> : null
                                ))
                                
                            }
                            </center>
                        </div>
                        <div className={`map-container ${!validQuantity() || !show ? "hidden" : "visible"}`}>
                            <Map markerOnClick = {markerOnClick} card = {title} description = {description} geoLocation = {geoLocation}/>
                        </div>
                    </> : <NotFound/>
                    
                }
            </div>
        </React.Fragment>
       
  );
}

export default General