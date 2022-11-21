import { useState } from "react";
import useGetLoginToken from "../hooks/useGetLoginToken";
import config from "../config.json";
import "../css/pages/LoginPage.css"

const LoginPage = ({ setLoginToken }) => {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const getLoginToken = useGetLoginToken();


  function handleSubmit(e) {
    e.preventDefault();

    // send a post request to the server asking for a token
    getLoginToken.sendRequest(
      JSON.stringify({"username" : username, "password" : password}),
      (res) => {
        localStorage.setItem("loginToken", res["token"]); 
        setLoginToken(res["token"]);
      },
      (_) => {
        setErrorMessage("Cannot login. Please provide correct username and password.")
      }
    )
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