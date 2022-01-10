import mongoose, { Schema } from 'mongoose';
import {TokenTypes} from './token.types'



const tokenSchema = new Schema<TokenTypes>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user",
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600
    }
});

export const token:any = mongoose.model("token", tokenSchema);