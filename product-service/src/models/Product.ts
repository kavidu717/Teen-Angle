
import mongoose, { Document, Schema } from "mongoose";

export interface IVariant{
    sku: string;
    attributes: Map<string, string>;
    stock: number;
    price?: number;
}

export interface IProduct extends Document{
    name: string;
    description: string;
    basePrice: number;
    images: string[];
    category: mongoose.Types.ObjectId;
    generalAttributes: Map<string, string>;
    variants: IVariant[];
    adminId: string;
}

const VariantSchema = new Schema<IVariant>({
  sku:
   { 
    type: String,
     required: true,
      unique: true 
    },
  attributes:
   { 
    type: Map, of: String,
     required: true
     },
  stock:
   { 
    type: Number,
     required: true,
      default: 0,
       min: 0 },
  price:
   {
    
    type: Number 
}
}, {
    
    _id: false
 });

 const ProductSchema = new mongoose.Schema({
   
    name: {
         type: String,
          required: true 
        },
    description: {
         type: String,
          required: true 
        },
    basePrice: {
         type: Number,
          required: true 
        },
    images: {
         type: [String],
          required: true ,
          validate: [arrayLimit, 'You can pass a maximum of 3 images']
        },
     category: {
         type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true
     } ,
     generalAttributes: {
       type: Map,
       of: mongoose.Schema.Types.Mixed,
         default: {}
     } ,
      variants: {
        type: [VariantSchema],
        required: true
      },
      adminId: {
        type: String,
        required: true
      },
    


 },{timestamps: true})

   function arrayLimit(val: string[]) {
  return val.length > 0 && val.length <= 3;
}

export default mongoose.model<IProduct>('Product', ProductSchema);
