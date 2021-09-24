import React, { createContext, useReducer } from "react";
import jwtDecode from "jwt-decode";

const initialState = {
  user: null,
};
if (localStorage.getItem("jwttoken")) {
  const token = jwtDecode(localStorage.getItem("jwttoken"));
  if (token.exp * 1000 < Date.now()) {
    localStorage.removeItem("jwttoken");
  } else {
    initialState.user = token;
  }
}

export const AuthContext = createContext({
  user: null,
  login: (data) => {},
  logout: () => {},
});

function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    default:
      return state;
  }
}

function AuthProvider(props) {
 
  const [state, dispatch] = useReducer(authReducer, initialState);
  function login(data) {
    localStorage.setItem("jwttoken", data.token);
    dispatch({ type: "LOGIN", payload: data });
  }
  function logout() {
    localStorage.removeItem("jwttoken");
    dispatch({ type: "LOGOUT" });
   
  }

  return (
    <AuthContext.Provider
      value={{ user: state.user, login, logout }}
      {...props}
    />
  );
}

export default AuthProvider;
