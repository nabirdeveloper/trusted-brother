import { Schema, Document, models, model } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  price: number;
  stock: number;
  sku: string;
  categories: string[];
  variants: Array<{ size?: string; color?: string }>;
  description?: string;
  images: string[];
  status: 'in_stock' | 'out_of_stock' | 'coming_soon';
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  sku: { type: String, required: true, unique: true },
  categories: [{ type: String, required: true }],
  variants: [
    {
      size: { type: String },
      color: { type: String },
    },
  ],
  description: { type: String },
  images: [{ type: String, required: true }],
  status: { 
    type: String, 
    required: true, 
    enum: ['in_stock', 'out_of_stock', 'coming_soon'], 
    default: 'in_stock'
  }
});

export default models.Product || model<IProduct>('Product', ProductSchema); 