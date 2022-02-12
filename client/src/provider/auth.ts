import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_CHECK, AUTH_ERROR } from "react-admin";

export default (type, params) => {
  if (type === AUTH_LOGIN) {
    const { username, password } = params;
    return fetch("http://localhost:3003/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: new Headers({ "Content-Type": "application/json" }),
    })
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((token) => {
        localStorage.setItem("token", token);
      });
  }
  if (type === AUTH_LOGOUT) {
    localStorage.removeItem("token");
    return Promise.resolve();
  }
  if (type === AUTH_ERROR) {
    const status = params.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("token");
      return Promise.reject();
    }
    return Promise.resolve();
  }
  if (type === AUTH_CHECK) {
    return localStorage.getItem("token") ? Promise.resolve() : Promise.reject();
  }
  return Promise.resolve();
};
