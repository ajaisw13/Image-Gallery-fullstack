import React, { useEffect, useState } from 'react'
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { Container, ImageListItemBar} from '@mui/material';
import imageGalleryStyles  from '../styles.js'

function Images(props) {
  const imagesData  = props.images
  const breakpoints = {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920
}
const classes = imageGalleryStyles()
const getColumns = (width) => {
    if (width < breakpoints.sm) {
        return 2
    } else if (width < breakpoints.md) {
        return 3
    } else if (width < breakpoints.lg) {
        return 6
    } else if (width < breakpoints.xl) {
        return 7
    } else {
        return 8
    }
}

const [columns, setColumns] = useState(getColumns(window.innerWidth))
const updateDimensions = () => {
    setColumns(getColumns(window.innerWidth))
}

useEffect(() => {
    return () => window.removeEventListener("resize", updateDimensions);
}, []);

  return (
    <Container>
       <ImageList className={classes.imageList} cols={columns} gaps={8} variant='standard' rowHeight={180}>
      {imagesData.map((item) => (
        <ImageListItem key={item.imageUrl} >
          <a className={classes.a_link} href={item.imageUrl} target="_blank" rel="noopener noreferrer">
          <img
            className={classes.image}
            src={`${item.imageUrl}?w=248&fit=crop&auto=format`}
            srcSet={`${item.imageUrl}?w=248&fit=crop&auto=format&dpr=2 2x`}
            alt={item.imageText}
            loading="lazy"
          />
          <ImageListItemBar
            title={item.imageText}
          />
         </a>
        </ImageListItem>
     
      ))}
    </ImageList>
    </Container>
  );
}

export default Images;
