import mongoose, { Schema, models } from "mongoose";

export interface IOrderItem {
  productId: string;
  title: string;
  quantity: number;
  price: number;
  image?: string | null;
}

export interface IOrder {
  email?: string;
  items: IOrderItem[];
  total: number;
  currency: string;
  stripeSessionId: string;
  status?: string;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: String, required: true },
  title: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  image: { type: String },
});

const OrderSchema = new Schema<IOrder>(
  {
    email: { type: String },
    items: { type: [OrderItemSchema], required: true },
    total: { type: Number, required: true },
    currency: { type: String, required: true },
    stripeSessionId: { type: String, required: true, unique: true },
    status: { type: String },
  },
  { timestamps: true }
);

export const Order = models.Order || mongoose.model<IOrder>("Order", OrderSchema);
