import React, {useEffect, useReducer} from 'react';
import {useHistory} from 'react-router-dom';
import axios from 'axios';
import * as ROUTES from "../routes/Routes"

const initialState = {
    title: "",
    description: "",
    geolocation: {lat:0, lng: 0},
    images: [],
    error: []
}

const reducer = (state, action) => {
    switch(action.type){
        case "SET_TITLE":
            return {...state, title: action.payload}
        case "SET_DESCRIPTION":
            return {...state, description: action.payload}
        case "SET_GEOLOCATION_LAT":
            return {...state, geolocation: {...state.geolocation, lat: +action.payload}}
        case "SET_GEOLOCATION_LNG":
            return {...state, geolocation: {...state.geolocation, lng: +action.payload}}
        case "SET_IMAGES":
            return {...state, images: state.images.concat([action.payload])}
        case "DELETE_IMAGE":
            return {...state, images: state.images.filter(el => el != action.payload)}
        case "CLEAR_IMAGES":
            return {...state, images:[]}
        case "SET_ERROR":
            return {...state, error: action.payload}
        case "SET_INITIAL":
            return {...initialState}
        default:
            return state
    }
}

function CreateRestaurant() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const history = useHistory();

    useEffect(() => {
        document.title = `Create New Restaurant`;
    }, []);

    const addImage = () => {
       [...document.getElementById("file_holder").files].map(file => {
        let reader  = new FileReader();
        reader.onloadend = function () {
            if(!state.images.includes(reader.result))
                dispatch({type: "SET_IMAGES", payload: reader.result});
        }
        if (file) {
            reader.readAsDataURL(file);
        }
       })
    }
    const imageDeleter = (image) => {
        if(image === 'all'){
            dispatch({type: "CLEAR_IMAGES"})
        }
        dispatch({type:"DELETE_IMAGE", payload: image});
    }
    const checkValidation = () => {
        let setError = [];
        if(state.title.length < 5){
            setError.push("Title must contain at least 5 digits.");
        }    
        if(state.description.length < 25 || state.description.length > 400){
            setError.push("Not valid description. The description must contain characters from 25 to 400");
        } 
        if(!state.geolocation.lat){
            setError.push("Invalid latitude value.");
        } 
        if(!state.geolocation.lng){
            setError.push("Invalid longitude value.");
        } 
        if(state.images.length > 9){
            setError.push("Images maximum count: 9");
        } 
        return setError;
    }

    const afterSubmit = (response) => {
        dispatch({type:'SET_INITIAL'});
        history.replace(ROUTES.GENERAL);
        setImages(response.data.insertId);
    }

    const setImages = (id) => {
        !localStorage.getItem('restaurant_images') && localStorage.setItem("restaurant_images", '{}');
        let obj = JSON.parse(localStorage.getItem('restaurant_images')), images = [];

        if(state.images.length){
            images = [...state.images]
        }else{
            images = [];
        }
        obj[`restaurantID:${id}`] = images;
        localStorage.setItem('restaurant_images', JSON.stringify(obj));
    }

    const submitHandler = (e) => {
        if(checkValidation().length){
            dispatch({type:"SET_ERROR", payload: checkValidation()})
            return;
        }
        e.preventDefault();
        dispatch({type:"SET_ERROR", payload: []})
        

        axios.post('http://localhost:3001/postData', {
            title: state.title,
            description: state.description,
            ratings: null,
            geolocation: JSON.stringify(state.geolocation),
        }).then((response) => afterSubmit(response)).catch((err) => console.log(err));
    }

  return (
    <div className = "restaurant-main-container">
        <div className = 'create-restaurant-form-holder'>
            <h1 className = 'text-center'>Create New Restaurant</h1>
            <div className = "form-container">
                <center>
                    <div>
                        <input
                            type = "text" 
                            placeholder = "Title"
                            style = {{width:'30%'}}
                            onChange = {(e) => dispatch({type: "SET_TITLE", payload: e.target.value})}
                            value = {state.title}
                        />
                    </div>
                    <br/>
                    <div className='geolocation-inputs-container'>
                        <div className='geolocation-inputs-holder'>
                            <label htmlFor = 'latitude'>Latitude: From -180 to 180</label>
                            <input 
                                id = 'latitude'
                                min={-180}
                                max={180}
                                step = "0.01"
                                type = "number" 
                                placeholder = "Set latitude"
                                onChange = {(e) => dispatch({type: "SET_GEOLOCATION_LAT", payload: e.target.value > 180 ? 180 : e.target.value < -180 ? 180 : e.target.value})}
                                value = {state.geolocation.lat}
                            />
                        </div>
                        <div className='geolocation-inputs-holder'>
                            <label htmlFor = 'longitude'>Longitude: From -180 to 180</label>
                            <input 
                                id = 'longitude'
                                min={-180}
                                max={180}
                                step = "0.01"
                                type = "number" 
                                placeholder = "Set longitude"
                                onChange = {(e) => dispatch({type: "SET_GEOLOCATION_LNG", payload: e.target.value > 180 ? 180 : e.target.value < -180 ? 180 : e.target.value})}
                                value = {state.geolocation.lng}
                            />
                        </div>
                    </div>
                
                    <textarea 
                        style = {{marginTop:'5%'}}
                        cols = {17} 
                        rows = {8} 
                        placeholder = "Write description..."
                        onChange = {(e) => dispatch({type: "SET_DESCRIPTION", payload: e.target.value})}
                        value = {state.description}
                    />
                    <br/>
                    <div className = "file-input">
                    <input 
                        type="file" 
                        id="file_holder" 
                        name = "file" 
                        accept = 'image/*' 
                        className = "file" 
                        onChange={() => addImage()} 
                        multiple = 'multiple'
                    />
                    <label 
                        htmlFor="file_holder"
                    >
                        Drag and drop your images
                    </label>
                    </div>
                    <div className = 'image-container'>
                    {
                        state.images.length ? state.images.map((el, index) => (
                            <React.Fragment key = {index}>
                                <div className='image-holder' style = {{backgroundImage:`url(${el})`}}>
                                    {/* <img key = {index} style={{objectFit:"cover"}} width={320} height={200} src = {el} /> */}
                                    <span
                                        onClick = {() => imageDeleter(el)}
                                    >
                                        X
                                    </span>
                                </div>
                                {
                                    index === state.images.length - 1 && 
                                    
                                    <button
                                        style = {{marginTop:"6%"}}
                                        className='clear-images-button'
                                        onClick={() => imageDeleter("all")}
                                    >
                                        Clear All Images
                                    </button>
                                }
                            </React.Fragment>
                        )) : null
                    }
                    </div>
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
  )
}

export default CreateRestaurant