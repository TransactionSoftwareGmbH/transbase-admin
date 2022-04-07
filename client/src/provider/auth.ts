import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_CHECK, AUTH_ERROR } from "react-admin";

export const authProvider = (type, params) => {
  if (type === AUTH_LOGIN) {
    const { username, password = "", connection } = params;
    return fetch("http://localhost:3003/auth", {
      method: "POST",
      body: JSON.stringify({ username, password, connection }),
      headers: new Headers({ "Content-Type": "application/json" }),
    })
      .then((response) => {
        if (!response.ok) {
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
    const token = localStorage.getItem("token");
    if (!token) {
      return Promise.reject();
    }
    return fetch("http://localhost:3003/auth", {
      method: "GET",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then((response) => {
      if (!response.ok) {
        localStorage.removeItem("token");
        throw new Error(response.statusText);
      }
      return true;
    });
  }
  return Promise.resolve();
};
