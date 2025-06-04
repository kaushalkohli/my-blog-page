import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    posts:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Post'
    }],

    createdAt: {
        type: Date,
        default: Date.now
    },

});


const User = mongoose.model('User', userSchema);
export default User;