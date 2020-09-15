import mongoose from 'mongoose';
import { Password } from '../services/password';

// An interface that describe the properties 
// that are required to create a new User
interface UserAttrs {
    email: string;
    password: string;
}

//An interface that describes the properties 
//that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;    
}

//An interface that describes the properties 
//that a User Document has
interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema({
    email: {
        //These are not typescript types, they are mongoose types
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

//Use the function keyword instead of the arrow function so that we can get access to the 
//document that is being saved using "this" keyword. When using the arrow function the value for the keyword "this" is 
//overwritten  with the context of the entire file 
userSchema.pre('save', async function(done) {
    if (this.isModified('password')) {
        //get password that is about to be saved to the database and hash it
        const hashed = await Password.toHash(this.get('password'));
        //update the value for the user password with the hashed one
        this.set('password', hashed);
    }
    done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel> ('User', userSchema);

export { User };