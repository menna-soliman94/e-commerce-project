import { ProductI } from "./products";

export interface WishlistResponseI {
  status?: string;
  message?: string;
  count?: number;
  data: ProductI[] | string[];
}
