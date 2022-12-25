import { CSSProperties } from "react";

export interface IconProps {
  fill?: string;
  stroke?: string;
  style?: CSSProperties;
  width?: string;
  height?: string;
  className?: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  total: number;
}

export interface Product {
  id: number;
  name: string;
  image: string | File;
  price: number;
  star: number;
  discount: number;
  category_id?: number;
  description?: string;
}

export interface LocationState {
  category: string;
  categories: Array<ProductCategory>;
}

export interface CartSession {
  total_quantity: number;
  total_price: number;
  data: Array<CartData>;
}

export interface CartData {
  id: number;
  name: string;
  image: string | File;
  kind?: number;
  price: number;
  quantity: number;
  category?: string;
}

export interface Column {
  id: string;
  label: string;
  minWidth?: string;
  align?: "inherit" | "left" | "right" | "center" | "justify" | undefined;
  format?: (value: number) => string;
}

export interface Coupon {
  code: string;
  discount: number;
  valid_from: string;
  valid_to: string;
}

export interface SignUpForm {
  username: string;
  password: string;
  confirm_password: string;
  phone: string;
  email: string;
  image?: File;
};

export interface LoginForm {
  username: string;
  password: string;
}

export interface DrawerState {
  signUp: { top: boolean; left: boolean; bottom: boolean; right: boolean };
  logIn: { top: boolean; left: boolean; bottom: boolean; right: boolean };
  profile: { top: boolean; left: boolean; bottom: boolean; right: boolean };
}

export interface User extends LoginForm {
  role: string;
  image: string;
  email: string;
  phone: string;
  _id: string;
}

export interface Category {
  name: string;
}

export interface CartCheckoutInfo {
  user_id: string;
  username: string;
  customer_name: string;
  customer_address: string;
  detail: CartSession;
}

