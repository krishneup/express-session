import mongoose, { Schema } from 'mongoose';
import {TokenTypes} from './token.types'



const tokenSchema = new Schema<TokenTypes>({
    userId: {
        type: String,
        required: true
        
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

export const Token:any = mongoose.model("token", tokenSchema);