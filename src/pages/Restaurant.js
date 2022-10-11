import React, {useReducer, useEffect} from 'react';
import '../App.css';
import ImagesList from '../components/ImagesList';
import { RatingMaker } from '../components/RatingMaker';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import axios from 'axios';
import * as ROUTES from "../routes/Routes";
import { useHistory } from 'react-router-dom';

const initialState = {
    restaurant: {},
    firstname: "",
    lastname: "",
    email: "",
    rating: 0,
    review: "",
    error: []
}

const reducer = (state, action) => {
    switch(action.type){
        case "SET_RESTAURANT":
            return {...state, restaurant: action.payload}
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

function Restaurant({getImages}) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const ratings = ["Worst", "Poor", "Below Average", "Average", "Good", "Excellent"];
    const history = useHistory();

    useEffect(() => {
        const {pathname} = history.location, id = pathname.substring(pathname.lastIndexOf('d') + 1, pathname.length);
        axios.post('http://localhost:3001/getData/restaurant', {
            id
        }).then((response) => setRestaurant(response)).catch((error) => console.log(error));
        
    }, []);

    const setRestaurant = (response) => {
        const restaurant = {...response.data[0]};
        restaurant.images = getImages(restaurant.id);
    
        dispatch({type: "SET_RESTAURANT", payload: {
            id: restaurant.id,
            title: restaurant.title,
            description: restaurant.description,
            images: restaurant.images,
            geolocation: JSON.parse(restaurant.geolocation),
            ratings: JSON.parse(restaurant.ratings)
        }});
    }
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
        if(!state.restaurant.ratings){
            state.restaurant.ratings = [addRating]
        }else{
            state.restaurant.ratings.unshift(addRating);
        }
        axios.post('http://localhost:3001/updateRating', {
            id: state.restaurant.id,
            ratings: JSON.stringify(state.restaurant.ratings)
        }).then(() => afterSubmit()).catch(() => console.log('error'));
    }

    const ratingCount = (rating) => {
        let count = 0;
        state.restaurant.ratings && state.restaurant.ratings.map((el) => {
            el.rating == rating && count++
        })
        return count;
    }
    
    return (
        state.restaurant && <div className = "restaurant-main-container">
        <div className = "restaurant-title-container">{state.restaurant.title}</div>
        <div className = "restaurant-elements">
            <center>
                <h3>{!state.restaurant.ratings ? "No Ratings" : "Average Rating"}</h3>
                {
                    state.restaurant.ratings &&   <RatingMaker 
                                                            readOnly 
                                                            value = {Math.round(state.restaurant.ratings.reduce((acc, val) => acc + val.rating, 0)/state.restaurant.ratings.length)} 
                                                            larg
                                                        />      
                }
                <br/>
                <br/>   
                {state.restaurant.images && state.restaurant.images.length ? <ImagesList images = {state.restaurant.images}/> : <h1>No Images To Show</h1>}
            </center>
            <div className = "restaurant-description-holder">
                {state.restaurant.description}
            </div>
            <div className = "restaurant-reviews-container">
                <div className = "restaurant-ratings">
                    <h2>Restaurant ratings</h2>
                    {
                        [5, 4, 3, 2, 1].map(el => ( <React.Fragment key = {el}>
                                                        <RatingMaker readOnly value = {el} small/>
                                                        <span style = {{margin:"0 0.5% 0 2%"}}>{ratings[el]}</span>
                                                        {` ${state.restaurant.ratings ? `(${ratingCount(el)})` : '(0)'}`}
                                                        <br/>
                                                        <br/>
                                                    </React.Fragment>))
                    }
                </div>
                <div className = "restaurant-reviews">
                    <center>
                        <h1>{state.restaurant.ratings ? "Reviews" : "No Reviews"}</h1>
                    </center>
                    {
                        state.restaurant.ratings && state.restaurant.ratings.map((el, index) => (
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