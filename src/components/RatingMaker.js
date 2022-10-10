import * as React from 'react';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';

export function RatingMaker(props) {
  const [value, setValue] = React.useState(props.value);

  return (
        <Rating  
          value={props.value || 0} 
          size = {props.large || !props.small ? "large" : "small"}
          readOnly  = {props.readOnly}
          emptyIcon={<StarIcon style={{ opacity: "40%", color:"rgb(241, 180, 69)"}} fontSize="inherit" />}
        />
  );
}
