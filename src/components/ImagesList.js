import React, {useState} from 'react';
import ImageList from '@mui/material/ImageList';

import ImageListItem from '@mui/material/ImageListItem';
import FullScreenImage from './FullScreenImage';

export default function ImagesList({images}) {
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [image, setImage] = useState("");

  const handleFullScreen = (image) => {
      setShowFullScreen(true);
      setImage(image);
  }
  return (
    <>
      <ImageList sx={{ width: 1200, maxHeight: 290, backgroundColor:'black'}} cols={3} rowHeight={200}>
        {images.map((item, index) => (
          <ImageListItem key={index}>
            <img
              src={`${item}`}
              alt='restaurant image'
              loading="lazy"
              onClick={() => handleFullScreen(item)}
            />
           </ImageListItem>
        ))}
      </ImageList>
      {
        showFullScreen ? <FullScreenImage handleClose = {() => setShowFullScreen(false)} image = {image}/> : null
      }
    </>
   
  );
}