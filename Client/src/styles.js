import { makeStyles } from '@mui/styles';

const imageGalleryStyles = makeStyles({
  a_link: {
    display: 'block',
  },
  image: {
    display: 'block',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'scale(1.03)',
    },
  },
  imageList: {
    width: '100%',
    paddingTop: 8,
  },
});

export default imageGalleryStyles;
