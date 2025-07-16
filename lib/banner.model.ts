import { Schema, Document, models, model } from 'mongoose';

export interface IBanner extends Document {
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema = new Schema<IBanner>({
  title: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String, required: true },
  linkUrl: { type: String },
  order: { type: Number, required: true, default: 0 },
  isActive: { type: Boolean, required: true, default: true },
}, {
  timestamps: true,
});

export default models.Banner || model<IBanner>('Banner', BannerSchema);
