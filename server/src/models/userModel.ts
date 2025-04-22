import mongoose, {Schema, Document} from 'mongoose';

interface IUser extends Document {
    firstName: string
    lastName: string
    email: string
    phone: number
    isAdmin: boolean
    isBlocked: boolean
    password: string
}



const UserSchema = new Schema<IUser>({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true,
    },
    email: { 
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true,
    }
})

const UserModel = mongoose.model("User",UserSchema);

export default UserModel