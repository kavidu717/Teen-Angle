import mongoose, { Document, Schema } from "mongoose";

export interface IAttributeDef {
    name: string;
    type: 'string' | 'number' | 'boolean'
}

export interface ICategory extends Document {
    name: string;
    image: string;
    dynamicAttributes: IAttributeDef[];
}

const CategorySchema: Schema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    dynamicAttributes: [{
        name: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ['string', 'number', 'boolean'],
            required: true
        }
    }]
},{timestamps: true});


export default mongoose.model<ICategory>('Category', CategorySchema);