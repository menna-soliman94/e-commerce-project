import { ProductI } from "./products";

export interface CartItemI {
  _id: string;
  count: number;
  price: number;
  product: ProductI;
}

export interface CartDataI {
  _id: string;
  cartOwner: string;
  products: CartItemI[];
  totalCartPrice: number;
}

export interface CartResponseI {
  message?: string;
  numOfCartItems: number;
  cartId?: string;
  data: CartDataI;
}
