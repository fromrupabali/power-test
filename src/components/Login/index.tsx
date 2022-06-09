import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { login, LoginStatus, logout, selectAuth } from "./authslice";
import styles from "./Login.module.css";

export function Login() {
  const auth = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const [loginUsername, setLoginUsername] = useState("");

  if (auth.status === LoginStatus.LOGGED_IN) {
    return (
      <div className={styles.container}>
        <span>Welcome, {auth.user.name}.</span>
        <button onClick={() => dispatch(logout())}>Logout</button>
      </div>
    );
  } else {
    return (
      <form
        className={styles.container}
        onSubmit={(e) => {
          e.preventDefault();
          dispatch(login({ username: loginUsername }));
        }}
      >
        <h3>Please log in to access this resource.</h3>
        <input
          type="text"
          placeholder="Username"
          value={loginUsername}
          onChange={(e) => setLoginUsername(e.target.value)}
        />
        <button disabled={auth.status === LoginStatus.LOGIN_PENDING}>
          Login
        </button>
      </form>
    );
  }
}
