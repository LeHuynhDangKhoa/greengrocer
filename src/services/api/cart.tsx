import { AxiosRequestConfig } from "axios";
import { API } from "..";
import { CartCheckoutInfo, LoginForm, SignUpForm } from "../../commons/Types";

const CartApi = {
  StoreCart(form: CartCheckoutInfo) {
    return API().post(`/cart/store`, form);
  },
};

export default CartApi;
