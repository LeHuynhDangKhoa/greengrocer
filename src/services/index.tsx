import axios from "axios";

declare global {
  interface Window {
    Configs: any;
  }
}

// export const BaseUrl = window.location.protocol + "//127.0.0.1:5000";
export const BaseUrl = "https://greengrocer-api.onrender.com";
// export const BaseUrl = window.location.protocol + "//127.0.0.1:8081";
// export const BaseUrl = window.Configs.apiBaseUrl;
export const UserRoleRoot = "root";
export const UserRoleAdmin = "admin";
export const UserRoleOperator = "operator";

const Api = axios.create({
  baseURL: BaseUrl,
  timeout: 100000,
  headers: {
    "Content-Type": "application/json",
  },
});

export function API() {
  Api.defaults.responseType = undefined;
  Api.defaults.headers.common["token"] =
    localStorage.getItem("token") === undefined ||
    localStorage.getItem("token") === "undefined" ||
    localStorage.getItem("token") == null
      ? ""
      : `${localStorage.getItem("token")}`;

  return Api;
}
