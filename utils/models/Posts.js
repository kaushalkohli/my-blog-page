import mongoose from 'mongoose'
import { type } from 'os';

const postSchema = new mongoose.Schema({
   
    content:{
        type: String,
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    username:{
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Post = mongoose.model('Post', postSchema);
export default Post;