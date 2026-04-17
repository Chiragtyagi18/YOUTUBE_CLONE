import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    watchHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video'
    }],
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar:{
        type: String,
        default: null
    },
    coverImage:{
        type: String,
        default: null
    },
    refreshToken:{
        type: String,
    },
    password: {
        type: String,   
        required: true
    },
    
}, { timestamps: true });
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});
userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function () {   
     const token = jwt.sign({ 
        id: this._id,
        email: this.email,
        username: this.username,
        fullName: this.fullName,
     }, 
        process.env.ACCESS_TOKEN_SECRET,
         { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
    return token;
}
userSchema.methods.generateRefreshToken = function () {
    const refreshToken = jwt.sign({ 
        id: this._id,
        email: this.email,
        username: this.username,
        fullName: this.fullName,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
    return refreshToken;
}
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
}
const User = mongoose.model('User', userSchema);

export default User;
