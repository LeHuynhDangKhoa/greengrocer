import { AxiosRequestConfig } from "axios";
import { API } from "..";
import { LoginForm, SignUpForm } from "../../commons/Types";

const AuthenApi = {
  SignUp(form: SignUpForm) {
    return API().postForm(`/sign_up/`, form);
  },

  Login(form: LoginForm) {
    return API().post(`/login/`, form);
  },

  Profile(id: string) {
    return API().get(`/users/` + id);
  },

  GetImage(url: string) {
    const config: AxiosRequestConfig = { responseType: 'blob' };
    return API().get(url, config);
  },

  UpdateProfile(form: SignUpForm, id: string) {
    return API().putForm(`/users/` + id, form);
  }
};

export default AuthenApi;
