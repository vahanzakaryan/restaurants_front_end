import React, {useReducer, useEffect, useState} from 'react';
import '../App.css';
import ImagesList from '../components/ImagesList';
import { RatingMaker } from '../components/RatingMaker';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import axios from 'axios';
import * as ROUTES from "../routes/Routes";
import { useHistory } from 'react-router-dom';
import PageNotFound from '../not_found/PageNotFound';

const initialState = {
    firstname: "",
    lastname: "",
    email: "",
    rating: 0,
    review: "",
    error: []
}

const reducer = (state, action) => {
    switch(action.type){
        case "SET_FIRSTNAME":
            return {...state, firstname: action.payload}
        case "SET_LASTNAME":
            return {...state, lastname: action.payload}
        case "SET_EMAIL":
            return {...state, email: action.payload}
        case "SET_RATING":
            return {...state, rating: action.payload}
        case "SET_REVIEW":
            return {...state, review: action.payload}
        case "SET_ERROR":
            return {...state, error: action.payload}
        case "SET_INITIAL":
            return {...initialState}
        default:
            return state
    }
}

function Restaurant({restaurantRef}) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const ratings = ["Worst", "Poor", "Below Average", "Average", "Good", "Excellent"];
    const history = useHistory();

    const checkValidation = () => {
        let setError = [];
        if(state.firstname.length < 2){
            setError.push("Firstname must contain at least 2 digits.");
        }    
        if(state.lastname.length < 2){
            setError.push("Lastname must contain at least 2 digits.");
        } 
        if(state.email.length < 2 || !state.email.includes('@')){
            setError.push("Enter valid E-mail address,");
        } 
        if(!state.rating){
            setError.push("Rate the restaurant.");
        } 
        if(state.review.length < 5 || state.review.length > 200){
            setError.push("Not valid review. The review must contain characters from 5 to 200");
        } 
        return setError;
    }

    const afterSubmit = () => {
        dispatch({type:"SET_INITIAL"});
        history.replace(ROUTES.GENERAL);
    }


    const submitHandler = (e) => {
        if(checkValidation().length){
            dispatch({type:"SET_ERROR", payload: checkValidation()})
            return;
        }
        e.preventDefault();
        dispatch({type:"SET_ERROR", payload: []})
        console.log("Submit");
        const addRating = {
            firstname: state.firstname,
            lastname: state.lastname,
            email: state.email,
            rating: state.rating,
            review: state.review
        };
        if(!restaurantRef.current.ratings){
            restaurantRef.current.ratings = [addRating]
        }else{
            restaurantRef.current.ratings.unshift(addRating);
        }
        axios.post('http://localhost:3001/updateRating', {
            id: restaurantRef.current.id,
            ratings: JSON.stringify(restaurantRef.current.ratings)
        }).then(() => afterSubmit()).catch(() => console.log('error'));
    }

    const ratingCount = (rating) => {
        let count = 0;
        restaurantRef.current.ratings && restaurantRef.current.ratings.map((el) => {
            el.rating == rating && count++
        })
        return count;
    }
    
    return (
        !restaurantRef.current ? <PageNotFound/>  :  <div className = "restaurant-main-container">
        <div className = "restaurant-title-container">{restaurantRef.current && restaurantRef.current.title}</div>
        <div className = "restaurant-elements">
            <center>
                <h3>{!restaurantRef.current.ratings ? "No Ratings" : "Average Rating"}</h3>
                {
                    restaurantRef.current.ratings &&   <RatingMaker 
                                                            readOnly 
                                                            value = {Math.round(restaurantRef.current.ratings.reduce((acc, val) => acc + val.rating, 0)/restaurantRef.current.ratings.length)} 
                                                            larg
                                                        />      
                }
                <br/>
                <br/>   
                {restaurantRef.current.images.length ? <ImagesList images = {restaurantRef.current.images}/> : <h1>No Images To Show</h1>}
            </center>
            <div className = "restaurant-description-holder">
                {restaurantRef.current.description}
            </div>
            <div className = "restaurant-reviews-container">
                <div className = "restaurant-ratings">
                    <h2>Restaurant ratings</h2>
                    {
                        [5, 4, 3, 2, 1].map(el => ( <React.Fragment key = {el}>
                                                        <RatingMaker readOnly value = {el} small/>
                                                        <span style = {{margin:"0 0.5% 0 2%"}}>{ratings[el]}</span>
                                                        {` ${restaurantRef.current.ratings ? `(${ratingCount(el)})` : '(0)'}`}
                                                        <br/>
                                                        <br/>
                                                    </React.Fragment>))
                    }
                </div>
                <div className = "restaurant-reviews">
                    <center>
                        <h1>{restaurantRef.current.ratings ? "Reviews" : "No Reviews"}</h1>
                    </center>
                    {
                        restaurantRef.current.ratings && restaurantRef.current.ratings.map((el, index) => (
                            <div key = {index} className = "single-review-container">
                                <h3>{el.firstname + " " + el.lastname + ' (' + el.email + ')'}</h3>
                                <p>{el.review}</p>
                                <center>
                                    <RatingMaker readOnly value = {el.rating} small/>
                                    <span style = {{margin:"0 0.5% 0 2%"}}>{ratings[el.rating]}</span>
                                </center>
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className = "review-writer-container">
                <h1>Write your own rewiew</h1>
                <div className = "form-container">
                    <center>
                        <input
                            type = "text" 
                            placeholder = "Firstname"
                            onChange = {(e) => dispatch({type: "SET_FIRSTNAME", payload: e.target.value})}
                            value = {state.firstname}
                        />
                        <input 
                            className='space-from-left'
                            type = "text" 
                            placeholder = "Lastname"
                            onChange = {(e) => dispatch({type: "SET_LASTNAME", payload: e.target.value})}
                            value = {state.lastname}
                        />
                        <input 
                            className='space-from-left'
                            type = "text" 
                            placeholder = "E-mail"
                            onChange = {(e) => dispatch({type: "SET_EMAIL", payload: e.target.value})}
                            value = {state.email}
                        />
                        <div 
                            className = "rating-field-holder"
                        >
                        <h3>
                            Give us your rating! 
                        </h3>
                        <Rating  
                            size = "large"
                            onChange = {(e, newValue) => dispatch({type:"SET_RATING", payload: newValue})}
                            value = {state.rating}
                            emptyIcon={<StarIcon style={{ opacity: "40%", color:"rgb(241, 180, 69)"}} fontSize="inherit" />}
                        />
                        </div>
                        <textarea 
                            cols = {10} 
                            rows = {5} 
                            placeholder = "Write your review..."
                            onChange = {(e) => dispatch({type: "SET_REVIEW", payload: e.target.value})}
                            value = {state.review}
                        />
                        <br/>
                        {   
                            state.error.length ? state.error.map((el, index) => (
                                <React.Fragment key = {index}>
                                    <br/>
                                    <span style = {{color:"red"}}>{el + " "}</span>
                                    <br/>
                                </React.Fragment>
                            )) : null
                        }
                        <button 
                            onClick={(e) => submitHandler(e)}
                            type = "submit"
                        >
                            Submit Review
                        </button>
                        <br/>
                       
                    </center>
                
                </div>
            </div>
        </div>
    </div>
       
    )
}

export default Restaurant