// models/Order.ts
import mongoose, { Schema, models } from "mongoose";

export interface IOrder {
  _id?: string;
  email?: string;
  items: {
    productId: string;
    title: string;
    price: number;
    quantity: number;
    image?: string | null;
  }[];
  total: number;
  currency: string;
  stripeSessionId: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    email: String,
    items: [
      {
        productId: String,
        title: String,
        price: Number,
        quantity: Number,
        image: String,
      },
    ],
    total: Number,
    currency: String,
    stripeSessionId: String,
    status: String,
  },
  { timestamps: true }
);

// Always return _id as string
OrderSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret._id = ret._id.toString();
  }
});

export const Order =
  models.Order || mongoose.model<IOrder>("Order", OrderSchema);
