type ProductId = string;

export type Products = {
  _id: ProductId;
  name: string;
  slug: string;
  category: string;
  image: string;
  price: number;
  brand: string;
  rating: number;
  quantity: number;
  numReviews: number;
  countInStock: number;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type Users = {
  _id: string;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
};

export type CartState = {
  darkMode: boolean;
  cart: {
    cartItems: Products[];
  };
};

export type CartAction = {
  type: string;
  payload: any;
};
