import React, { useState } from 'react';
import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api';
import CustomTooltip from '../components/CustomTooltip';

const containerStyle = {
  width: '80%',
  height: '300px',
  borderRadius:"30px"
};

const Map = ({title, description, geoLocation, markerOnClick}) => {
  const {REACT_APP_API_KEY} = process.env;
  const [showTooltip, setShowTooltip] = useState(false);
  const handleShowTooltip = () => {
    if(!description.length){
      return;
    }
    setShowTooltip(true);
  }
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: REACT_APP_API_KEY,
    libraries: ['geometry', 'drawing'],
  });
  return (
    <React.Fragment>
      <h3>Location of the restaurant</h3>
      {
        isLoaded && <GoogleMap
                      mapContainerStyle={containerStyle}
                      center={{lat: +geoLocation.lat, lng: +geoLocation.lng}}
                      zoom={15}
                      onClick={markerOnClick}
                      onMouseOver = {() => setShowTooltip(false)}
                    >
                    {
                      <MarkerF 
                        title = {title}
                        onClick={markerOnClick}
                        position={{lat: +geoLocation.lat, lng: +geoLocation.lng}}
                        onMouseOver = {handleShowTooltip}
                        onMouseOut = {() => setShowTooltip(false)}
                      />
                    }
                    </GoogleMap>
      }
    {showTooltip && <CustomTooltip description = {description}/>}
    </React.Fragment>
  
  )
}

export default React.memo(Map)


