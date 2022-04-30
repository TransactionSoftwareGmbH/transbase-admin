import { AuthProvider } from "react-admin";

export const authProvider: AuthProvider = {
  login: ({ username, password = "", connection }) => {
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
        localStorage.setItem("user", username);
      });
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return Promise.resolve();
  },
  checkError: ({ status }) => {
    if (status === 401 || status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return Promise.reject();
    }
    return Promise.resolve();
  },
  checkAuth: () => {
    if (!localStorage.getItem("token")) {
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
      Promise.resolve();
    });
  },
  getPermissions: () => {
    const role = localStorage.getItem("role");
    return Promise.resolve(role);
  },
  getIdentity: () => {
    return Promise.resolve({
      id: localStorage.getItem("user")!,
      fullName: localStorage.getItem("user")!,
    });
  },
};
