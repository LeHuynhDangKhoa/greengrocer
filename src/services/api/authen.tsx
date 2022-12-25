import { AxiosRequestConfig } from "axios";
import { API } from "..";
import { LoginForm, SignUpForm } from "../../commons/Types";

const AuthenApi = {
  SignUp(form: SignUpForm) {
    return API().postForm(`/register`, form);
  },

  Login(form: LoginForm) {
    return API().post(`/login`, form);
  },

  Profile(id: number) {
    return API().get(`/users/` + id.toString());
  },

  GetImage(url: string) {
    const config: AxiosRequestConfig = { responseType: 'blob' };
    return API().get(url, config);
  },

  UpdateProfile(form: SignUpForm, id: number) {
    return API().putForm(`/users/` + id.toString(), form);
  }
};

export default AuthenApi;
