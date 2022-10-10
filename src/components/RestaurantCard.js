import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import { RatingMaker } from './RatingMaker';

export default function RestaurantCard({ card, image, storeRestaurantInfo }) {

  const averageRating = () => Math.round(card.ratings.reduce((acc, val) => acc + val.rating, 0)/card.ratings.length);

  return (
    <Card sx={{ backgroundPosition:"center", width: 600, maxHeight: 500, borderRadius: 10, transform:"scale(0.8)", backgroundColor: "rgba(0, 0, 0, 70%)", color:"white"}}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="250"
          image={`${image === 'no-image' ? 'images/restaurants/' + image + '.jpeg' : image}`}
          alt="green iguana"
        />
        <CardContent>
          <Typography style={{display: "inline-block"}} gutterBottom variant="h5" component="div">
            {card.title}
          </Typography>
          <Typography variant="body2" color="text.primary" style = {{overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis", color:"white"}}>
            {card.description}
          </Typography>
          <br/>
          <RatingMaker large value = {!card.ratings ? 0 : averageRating()} readOnly/>
        </CardContent>
      </CardActionArea>
      <CardActions style = {{backgroundColor:"black"}}>
        <Button style = {{margin:"auto", color:"white"}} size="large" color="primary" onClick={() => storeRestaurantInfo(card)}>
          View Restaurant
        </Button>
      </CardActions>
    </Card>
  );
}
