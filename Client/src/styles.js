import {makeStyles} from '@mui/styles';

const imageGalleryStyles = makeStyles({
    a_link: {
      display: 'block',
      height: '100%',
    },
    image: {
      objectFit: 'cover',
      width: '100%',
      height: '100%',
     
    },
    progress:{
        display: "flex",
        marginLeft: "50%"
    },
    imageGalleryContainer:{
        width: "10%",
        height: "5%",
        // margin: "0 auto",
        display: "flex !important", 
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"

      },
    uploadImage: {
        width: 200,
        height: 150
      },
    previewImage:{
        border: "solid",
        borderColor: "cadetblue",
        borderWidth: "thick",
        width: 200,
        height: 150
        },
    titleTextBox:{
        display: "flex ",
        width: 200,
      },
    alert:{ 
        width: "100%", 
        height: "100%", 
        marginTop: 5
      },
    imageList:{
      width: "100%",
      height: "100%",
      paddingTop: 5,
      overflowY:"hidden !important"
    }
  });

export default imageGalleryStyles;
