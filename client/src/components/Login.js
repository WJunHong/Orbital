import React, { Fragment, useState } from "react";
import { Link, Redirect } from "react-router-dom";

const Login = ({ setAuth }) => {
  const [inputs, setInputs] = useState({
    email: "",
    password: ""
  });

  const { email, password } = inputs;

  const onChange = e =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

  const onSubmitForm = async e => {
    // Prevent page from reloading
    e.preventDefault();
    try {
      const body = { email, password };
      // Send a login post request with the credentials given. Initally unauthenticated
      const response = await fetch(
        "/auth/login",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify(body)
        }
      );
      // Returns the JWT token
      const parseRes = await response.json();
      
      // If there is a JWT token, save it to localStorage, and make user authorized to use the web app.
      if (parseRes.token) {
        localStorage.setItem("token", parseRes.token);
        localStorage.setItem("auth", true);
        setAuth(true);
      } else {
        setAuth(false);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
      <h1 className="mt-5 text-center">Login</h1>
      <form onSubmit={onSubmitForm}>
        <input
          type="text"
          name="email"
          value={email}
          onChange={e => onChange(e)}
          className="form-control my-3"
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={e => onChange(e)}
          className="form-control my-3"
        />
        <button class="btn btn-success btn-block">Submit</button>
      </form>
      <Link to="/register">register</Link>
    </Fragment>
  );
};

export default Login;