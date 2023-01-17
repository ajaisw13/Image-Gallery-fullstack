import React, { useEffect } from 'react'
import { useState  } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { PickerOverlay } from 'filestack-react';
import Images from './Images';
import {Button,TextField, Alert} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import Container from '@mui/material/Container';
import axios from 'axios';
import imageGalleryStyles from '../styles';

function ImageGallery() {
  const [isFilePicker, setIsFilePicker] = useState(false)
  const [uploadedImage, setUploadedImage] = useState("")
  const [uploadedImageTitle, setUploadedImageTitle] = useState("")
  const [images, setImages] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const [isGetImagesError, setIsGetImagesError] = useState(false)
  const [isUploadFailed, setUploadFailed] = useState(false)

  const getImages = async () => {
      try {
        setIsLoading(true)
        let res = await axios.get(process.env.REACT_APP_GET_IMAGES)
        setImages(res.data)
        setIsLoading(false)
      } catch (error) {
        setIsGetImagesError(true)
        setIsLoading(false)
      }
  }

  const uploadImageToDB = async (data) => {
    try {
      await axios.post(process.env.REACT_APP_POST_IMAGE_URL, data)
      getImages()
      setUploadedImage("")
      setUploadedImageTitle("")
      setUploadFailed(false)
    } catch (error) {
      setUploadFailed(true)
      setUploadedImage("")
      setUploadedImageTitle("")
    }
}
  useEffect(() => {
    getImages();
  },[])
  
  const classNames = imageGalleryStyles()

  return (
    <React.Fragment>
      {isLoading && <CircularProgress  size={100} className={classNames.progress}/>}
     {!isLoading && <><Container  maxWidth="sm" className={classNames.imageGalleryContainer}>
       { uploadedImage && <img
        src={`${uploadedImage}?w=164&h=164&fit=crop&auto=format`}
        srcSet={`${uploadedImage}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
        alt={uploadedImageTitle}
        loading="lazy"
        className={classNames.previewImage}
      />}
      {!uploadedImage && <Button
      onClick = {() => isFilePicker ?  setIsFilePicker(false): setIsFilePicker(true)}
      variant="outlined"
      className={classNames.uploadImage}
      >
        <AddIcon>add_circle</AddIcon>Upload Image</Button>}
      
      <TextField id="outlined-basic" placeholder="Enter image title" required
        value={uploadedImageTitle}
        className={classNames.titleTextBox}
        onChange={(event) => {
          setUploadedImageTitle(event.target.value)
        }} 
        style={{
          marginTop: 10,
          marginBottom: 10
        }}/>
      <div style={{
        width: 200
      }}>
      <Button 
      type="submit" variant="contained"
      sx={{
       float: "left"
      }}
      onClick={() => {
        uploadImageToDB({
          imageUrl:uploadedImage,
          imageText: uploadedImageTitle})
      }}
      disabled={!uploadedImage || !uploadedImageTitle}
      >Submit</Button>
      <Button 
      type="submit" variant="contained"
      sx={{
       float: "right"
      }}
      onClick={() => {
        setUploadedImage("")
        setUploadedImageTitle("")
        setIsFilePicker(false)
      }}
      disabled={!uploadedImage}
      >Reset</Button>
      </div>
     { isFilePicker && (<PickerOverlay
    apikey={process.env.REACT_APP_FILESTACK_API_KEY}
    onSuccess={(res) => {
      setUploadedImage(res.filesUploaded[0].url)
      setIsFilePicker(false)
    }}
    onError={(res) => console.log(res)}
    pickerOptions={{
      maxFiles: 1,
      accept:["image/*"],
      errorsTimeout: 2000,
      maxSize: 1024*1024
    }}
  />)}
  </Container>
  {isGetImagesError && <Alert severity="error" className={classNames.alert}>Something went wrong while fetching the images!</Alert>}
  {isUploadFailed && <Alert severity="error" className={classNames.alert}>Unable to upload images. Please try again!</Alert>}
      {!isGetImagesError && <Images images={images}/>}
      </>}
    </React.Fragment>
  );
}

export default ImageGallery;
