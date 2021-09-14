type ProductId = string;

export type Address = {
  fullName: string;
  address: string;
  city: string;
  postalCode: number;
  country: string;
};

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

export type AuthUser = {
  _id?: string;
  name?: string;
  email?: string;
  isAdmin?: boolean;
  exp?: number;
  iat?: number;
};

export type Users = {
  _id: string;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  token: string;
};

type CartItems = {
  cartItems: Products[];
  shippingAddress: Address;
  paymentMethod?: string;
};

export type CartState = {
  darkMode: boolean;
  cart: CartItems;
  userInfo: Users;
};

export type CartAction = {
  type: string;
  payload: any;
};

export type GError = {
  message: string;
  response: {
    data: {
      message: string;
    };
  };
};
