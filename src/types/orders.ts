import { ProductI } from "./products";

export interface ShippingAddressI {
  details: string;
  phone: string;
  city: string;
}

export interface OrderCartItemI {
  _id?: string;
  count: number;
  price: number;
  product: ProductI;
}

export interface OrderI {
  _id: string;
  id?: number;
  cartItems: OrderCartItemI[];
  shippingAddress: ShippingAddressI;
  totalOrderPrice: number;
  paymentMethodType: string;
  isPaid: boolean;
  isDelivered: boolean;
  createdAt: string;
  updatedAt: string;
}
