import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'User Name is req.'],//user name is ....-> error message
        trim: true,
        minLength: 2,
        maxLength: 50,
    },
    email:{
        type: String,
        required: [true, 'User Email is req.'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please fill a valid email address']
    },
    password:{
        type: String,
        required: [true, 'User password is req.'],
        minLength: 6,
    }
},{timestamps:true});
                          //name---> model name typically starts with capital letter(i.e. User)
const User = mongoose.model('User',userSchema);//new model of above schema

export default User;