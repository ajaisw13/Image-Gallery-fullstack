import mongoose from 'mongoose'

const ImageModel = mongoose.model("Image", new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true,
    },
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
