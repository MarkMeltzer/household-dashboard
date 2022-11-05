import { useState } from "react";
import config from "../config.json";
import "../css/pages/LoginPage.css"

const LoginPage = ({ setLoginToken }) => {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);


  function handleSubmit(e) {
    e.preventDefault();

    // send a post request to the server asking for a token
    console.log(config.DATA_SERVER_URL + "/getLoginToken")
    const apiURL = config.DATA_SERVER_URL + "/getLoginToken"
    const requestOpts = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({"username" : username, "password" : password})
    }
    fetch(apiURL, requestOpts)
      .then(res => res.json())
      .then(
        res => {
          localStorage.setItem("loginToken", res["token"]); 
          setLoginToken(res["token"]);

        },
        err => {
          // error
          setErrorMessage("Cannot login. Please provide correct username and password.")
        })
  }

  return <div className="login">
    <p>
       You are not logged in. Please log in. 
    </p>
    <form onSubmit={handleSubmit}>
      {errorMessage && 
        <div>
          <p>{errorMessage}</p>
        </div>}
      <div className="usernameContainer">
        <label>
          <p>Username:</p>
          <input type="text" onChange={(e) => setUsername(e.target.value)}/>
        </label>
      </div>

      <div className="passwordContainer">
        <label>
          <p>Password:</p>
          <input type="password" onChange={(e) => setPassword(e.target.value)}/>
        </label>
      </div>

      <button type="submit">Login!</button>
    </form>
  </div>
}

export default LoginPage;