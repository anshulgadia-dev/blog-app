import mongoose, { model } from "mongoose";
import bcrypt from 'bcrypt'


const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        unique : true,
        required : true,
        trim : true,
        lowercase : true,
    },
    password : {
        type : String,
        required : true,
        select : false
    }
})


userSchema.pre('save' , async function (next) {
    const user = this;
    if(!this.isModified("password")) return;
    user.password = await bcrypt.hash(user.password , 10);
})

userSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword , this.password);
}

userSchema.statics.isEmailTaken = async function(email){
    const user = await this.findOne({email});
    return !!user;
}

const User = model("User" , userSchema);

export default User;