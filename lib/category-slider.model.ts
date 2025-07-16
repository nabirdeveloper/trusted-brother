import { Schema, Document, models, model, Types } from 'mongoose';

export interface ICategorySlider extends Document {
  category: Types.ObjectId;
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySliderSchema = new Schema<ICategorySlider>({
  category: { 
    type: Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true 
  },
  title: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String, required: true },
  linkUrl: { type: String },
  order: { type: Number, required: true, default: 0 },
  isActive: { type: Boolean, required: true, default: true },
}, {
  timestamps: true,
});

export default models.CategorySlider || model<ICategorySlider>('CategorySlider', CategorySliderSchema);
