import mongoose, { Schema, models } from "mongoose";

export interface IProduct {
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
}

const ProductSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    images: { type: [String], default: [] },
    category: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export const Product = models.Product || mongoose.model<IProduct>("Product", ProductSchema);
