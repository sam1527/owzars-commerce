// models/Product.ts
import mongoose, { Schema, models } from "mongoose";

export interface IProduct {
  _id?: string | mongoose.Types.ObjectId; // returned as string in API responses
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProductSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    images: { type: [String], default: [] },
    category: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

// ALWAYS convert _id → string in responses
ProductSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret: any) => {
    ret._id = ret._id.toString();
  }
});

export const Product =
  models.Product || mongoose.model("Product", ProductSchema);
