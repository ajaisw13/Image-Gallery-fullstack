import mongoose from 'mongoose'

const ImageModel = mongoose.model("Image", new mongoose.Schema({
    imageText: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    }
}))

export default ImageModel;
